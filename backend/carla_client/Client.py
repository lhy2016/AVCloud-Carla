import carla

class Client:
    __instance = None
    
    def __init__(self):
        return

    @staticmethod
    def instance():
        if Client.__instance == None: 
            Client.__instance = carla.Client('13.52.230.201', 2000)
            Client.__instance.set_timeout(20.0)
            Client.__instance.load_world("Town02")
        return Client.__instance