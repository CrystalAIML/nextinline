# To use .env files, install python-dotenv: pip install python-dotenv
from dotenv import load_dotenv
load_dotenv()
import os

# Suggester settings
SUGGESTER_TYPE = os.getenv("SUGGESTER_TYPE", "google")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "YOUR_API_KEY_HERE")

# Datastore settings
# Valid values: 'memory', 'firestore'
DATASTORE_TYPE = os.getenv("DATASTORE_TYPE", "memory") 