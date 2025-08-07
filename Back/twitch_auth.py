import os
import requests
from dotenv import load_dotenv

load_dotenv()

client_id = os.getenv("TWITCH_CLIENT_ID")
client_secret = os.getenv("TWITCH_CLIENT_SECRET")

auth_response = requests.post(
    'https://id.twitch.tv/oauth2/token',
    params={
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'client_credentials'
    }
)

access_token = auth_response.json()['access_token']

headers = {
    'Client-ID': client_id,
    'Authorization': f'Bearer {access_token}'
}
