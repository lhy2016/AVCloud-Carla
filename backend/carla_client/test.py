import carla
from carla import Transform, Location, Rotation

client = carla.Client("localhost",2000)
client.set_timeout(2000)
world = client.get_world()
world = client.load_world('Town02')
bpl = world.get_blueprint_library()
bp = bpl.find("vehicle.tesla.model3")
point = Transform(Location(x=194, y=306, z=10), Rotation(yaw=90))
vehicle = world.try_spawn_actor(bp, point)
vehicle.set_autopilot(True)
while True:
    pass