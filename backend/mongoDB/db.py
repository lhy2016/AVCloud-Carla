from pymongo import MongoClient

class db:
    __instance = None
    
    def __init__(self):
        return

    @staticmethod
    def instance():
        if db.__instance == None: 
            client = MongoClient("mongodb://admin:cmpe281Group8@3.101.103.200/avcloud")
            db.__instance = client["avcloud"]
        return db.__instance