from pymongo import MongoClient

client: MongoClient = MongoClient(host="mongo", port=27017)
database = client.get_database("backend")
users_collection = database.get_collection("users")
