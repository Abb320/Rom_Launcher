#6/15/2025
#All functions to be used in app

#imports
import os #used to make/manage files
import shutil #used to remove folder with everything inside
from pathlib import Path #used to check files
import sqlite3 #used work with SQL table
from dotenv import load_dotenv #used to get .env stuff
import requests #used to access api
from twitch_auth import client_id, client_secret, access_token, headers #get vars for twitch api stuff

#globals
dir = os.getcwd() #initial directory to be specified by use on launch

def Get_box_art(game,hight,width):
    game_response = requests.get(
        'https://api.twitch.tv/helix/games',
        headers=headers,
        params={'name': game}
    )


    game_data = game_response.json()
    game_box_raw = game_data["data"][0]["box_art_url"]
    game_box_fixed = box_url = game_box_raw.replace("{width}", f'{width}').replace("{height}", f'{hight}')
    return(game_box_fixed)


#file creation function: makes file directory with all folders for consoles Also checks for SQL DB and makes one  if not
def create_dir(dir):
    path_to_origin = os.path.join(dir, "consoles")
    
    if not os.path.isdir(path_to_origin):
        os.mkdir(path_to_origin)
        consoles = ["wii", "xbox"]
        for console in consoles:
            os.mkdir(os.path.join(path_to_origin, console))

    db_path = os.path.join(path_to_origin, "games.db")
    conn = sqlite3.connect(db_path)
    return path_to_origin, conn

#Scrape Directory Function: scrapes all folders made by create_dir and returns games as lists in list as [["name","console"]]
def scrape_dir(dir):
    game_list = []
    for folder in os.listdir(dir):
        folder_path = os.path.join(dir, folder)
        if not os.path.isdir(folder_path):
            continue
        for file in os.listdir(folder_path):
            if file == "games.db":
                continue  # Skip the DB file
            box_art = Get_box_art(file.split('(')[0].rstrip(' '),700,450)
            game_list.append([folder,file.split('(')[0].rstrip(' '),f'{dir}/{file}',file.split('(')[0],box_art])
        return game_list
    
#Enter Data into SQL Function
def SQL_commit(cursor):
  cursor.execute('''
  CREATE TABLE IF NOT EXISTS games (
      console TEXT NOT NULL,
      name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      box_art TEXT NOT NULL
  )
  ''')
  conn.commit()

  for game in scrape_dir(dir):
    cursor.execute(
      "SELECT 1 FROM games WHERE name = ? AND console = ?",
      (game[0], game[1])
    )
    result = cursor.fetchone()
    if not result:
        cursor.execute(
          "INSERT INTO games (name, console, file_path, box_art) VALUES (?, ?, ?, ?)",
          (game[0], game[1], game[2], game[4])
        ) 
  conn.commit()

  cursor.execute("SELECT * FROM games")
  rows = cursor.fetchall()

  # for row in rows:
  #     print(row)

#Random game function: returns a random game from the SQL table
def random_game(cursor):
  cursor.execute("SELECT * FROM games ORDER BY RANDOM() LIMIT 1")
  return cursor.fetchone()
#Launch game function

#clear consoles folderL only for testing purposes to reset dir
def reset(dir):
  shutil.rmtree(dir)
  print("reset")

dir,conn = create_dir(dir)
cursor = conn.cursor()
SQL_commit(cursor)

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "create_dir":
        path, _ = create_dir(dir)
        print(f"Created directories at: {path}")
