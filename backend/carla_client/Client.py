import carla

class Client:
    __instance = None
    
    def __init__(self):
        return

    @staticmethod
    def instance():
        if Client.__instance == None: 
            # Client.__instance = carla.Client('54.153.84.14', 2000)
            Client.__instance = carla.Client('localhost', 2000)
            Client.__instance.set_timeout(20.0)
            # Client.__instance.load_world("Town02")
        return Client.__instance