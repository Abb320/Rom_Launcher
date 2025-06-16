#6/15/2025
#All functions to be used in app

#imports
import os #used to make/manage files

dir = os.getcwd()

# Rom_dict # collection of all consoles : and relevent extentions

#get dir function: get a user specified directory to make folders
# def get_dir():
#   dir = input("")
#   return dir


#file creatoion function: makes file directory with all folders for consoles
def create_dir(dir):
  path_to_origin = f'{dir}/consoles'
  os.mkdir(path_to_origin)
  consoles = ["wii","xbox"]
  for console in consoles:
    path = f'{path_to_origin}/{console}'
    os.mkdir(path)
  return

#Scrape Directory Function

#Enter Data into SQL Function

#Random game function

#Launch game function


# dir = get_dir()
create_dir(dir)