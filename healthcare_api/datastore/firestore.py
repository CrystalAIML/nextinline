# To use this, install: pip install google-cloud-firestore
# And set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON file.
from google.cloud import firestore
from ..models import Appointment, Doctor, Notification, Location, Coordinates

class GoogleFirestoreDatastore:
    def __init__(self):
        self.client = firestore.Client()

    @property
    def doctors(self):
        return FirestoreCollection(self.client.collection('doctors'), Doctor)

    @property
    def appointments(self):
        return FirestoreCollection(self.client.collection('appointments'), Appointment)

    @property
    def notifications(self):
        return FirestoreCollection(self.client.collection('notifications'), Notification)

class FirestoreCollection:
    def __init__(self, collection_ref, model_cls):
        self.collection_ref = collection_ref
        self.model_cls = model_cls

    def __getitem__(self, key):
        doc = self.collection_ref.document(key).get()
        if doc.exists:
            return self.model_cls(**doc.to_dict())
        else:
            raise KeyError(key)

    def __setitem__(self, key, value):
        # Convert Pydantic models to dict before saving
        if hasattr(value, "dict"):
            value = value.dict()
        self.collection_ref.document(key).set(value)

    def __delitem__(self, key):
        self.collection_ref.document(key).delete()

    def get(self, key, default=None):
        try:
            return self[key]
        except KeyError:
            return default

    def values(self):
        docs = list(self.collection_ref.stream())
        print(f"Firestore raw docs: {[doc.to_dict() for doc in docs]}")
        return [self.model_cls(**doc.to_dict()) for doc in docs]

_firestore_instance = None

def get_instance():
    global _firestore_instance
    if _firestore_instance is None:
        _firestore_instance = GoogleFirestoreDatastore()
    return _firestore_instance 