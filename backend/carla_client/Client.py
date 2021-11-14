import carla

class Client:
    __instance = None
    
    def __init__(self):
        return

    @staticmethod
    def instance():
        if Client.__instance == None:
            Client.__instance = carla.Client('localhost', 2000)
            Client.__instance.set_timeout(20.0)
        return Client.__instance