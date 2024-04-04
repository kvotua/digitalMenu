from pymongo import MongoClient

client: MongoClient = MongoClient(host="mongo", port=27017)
database = client.get_database("backend")
users_collection = database.get_collection("users")
products_collection = database.get_collection("products")
compositions_collection = database.get_collection("compositions")
tags_collection = database.get_collection("tags")
