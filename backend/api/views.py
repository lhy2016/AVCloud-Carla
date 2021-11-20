from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
from django.http.response import HttpResponseBadRequest
from django.utils.timezone import activate
from .models import *
from .serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core import serializers
from datetime import datetime
import random
from carla_client.Client import Client
import threading
import json
import math
# Create your views here.

def homepage(request):
    print("inside homepage")
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")
    # return render(request, "homepage.html")
    # return render(request, "rent_vehicle.html")

@api_view(['POST'])
def add_vehicle(request):
    name = request.data["name"]
    make = request.data["make"]
    color = request.data["color"]
    
    client = Client.instance()
    world = client.get_world()
    bpl = world.get_blueprint_library()

    car_blueprints = {
        "mini": bpl.find("vehicle.mini.cooper_s"),
        "tesla": bpl.find("vehicle.tesla.model3"),
        "audi": bpl.find("vehicle.audi.tt")
    }
    colors = {
        "yellow": '217,203,82',
        "red": '255,0,0',
        "blue": '0,0,255',
        "silver": '219,219,219'
    }
    bp = car_blueprints[make]
    car_color = colors[color]
    bp.set_attribute("role_name", name)
    bp.set_attribute("color", car_color)

    map = world.get_map()
    spawn_points = map.get_spawn_points()
    random_point = random.choice(spawn_points)
    carla_vehicle = world.try_spawn_actor(bp, random_point)
    if carla_vehicle != None:
        carla_vehicle.set_autopilot(True)
        vehicle = Vehicle(name=name, make=make, color=color)
        vehicle.save()
        vehicle_obj = Vehicle.objects.get(id=vehicle.id)
        serialized_vehicle = serializers.serialize('json', [ vehicle_obj, ])
        print(f"Serialized is: {serialized_vehicle}")
        return Response(serialized_vehicle, status=status.HTTP_200_OK)
    return Response({"error":"Failed to spawn "+ name + " on Carla map, please try again later"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def remove_vehicle(request, id):
    vehicle_obj = Vehicle.objects.get(id=id)
    vehicle_obj.delete()
    serialized_vehicle = serializers.serialize('json', [ vehicle_obj, ])

    client = Client.instance()
    world = client.get_world()
    
    all_cars = world.get_actors().filter("vehicle.*")
    car_to_delete = [car for car in all_cars if car.attributes.get("role_name") == vehicle_obj.name]
    
    if len(car_to_delete) == 1:
        car = car_to_delete[0]
        car.destroy()   
    return Response(serialized_vehicle, status=status.HTTP_200_OK)

@api_view(['PUT'])
def mark_available(request, id):
    availability = "True"
    Vehicle.objects.filter(id=id).update(is_available=availability)
    vehicle_obj = Vehicle.objects.get(id=id)
    serialized_vehicle = serializers.serialize('json', [ vehicle_obj, ])
    return Response(serialized_vehicle, status=status.HTTP_200_OK)

@api_view(['PUT'])
def mark_unavailable(request, id):
    availability = "False"
    Vehicle.objects.filter(id=id).update(is_available=availability)
    vehicle_obj = Vehicle.objects.get(id=id)
    serialized_vehicle = serializers.serialize('json', [ vehicle_obj, ])
    return Response(serialized_vehicle, status=status.HTTP_200_OK)

@api_view(['POST'])
def rent_vehicle(request):
    
    print("****RENT_VEHICLE*****")
    data = request.data
    
    pickupX = int(data["pickup"]["x"] * 194)
    pickupY = int(106 + data["pickup"]["y"] * 200)
    pickupCoord = str(pickupX) + "," + str(pickupY)

    destX = int(data["dest"]["x"] * 194)
    destY = int(106 + data["pickup"]["y"] * 200)
    destCoord = str(destX) + "," + str(destY)
    
    userId = data["user_id"]
    user_obj = User.objects.get(id=userId)
    
    vehicleId = data["vehicle_id"]
    vehicle_obj = Vehicle.objects.get(id=vehicleId)
    vehicle_name = vehicle_obj.name

    rental = Rental(pickup_coord=pickupCoord, dest_coord=destCoord, user_id=user_obj, vehicle_id=vehicle_obj, active_status=True)
    rental.save()

    client = Client.instance()
    world = client.get_world()
    
    all_cars = world.get_actors().filter("vehicle.*")
    carla_car = [car for car in all_cars if car.attributes.get("role_name") == vehicle_name]
    if len(carla_car) != 1:
        return Response("Error: Can't find the vehicle you want to rent", status=status.HTTP_400_BAD_REQUEST)
    
    car = carla_car[0]
    import os
    import sys
    sys.path.append('carla_client')
    from agents.navigation.basic_agent import BasicAgent
    from carla import Location
    agent = BasicAgent(car)
    destination = Location(x=pickupX, y=pickupY, z=0)
    agent.set_destination(destination)

    import traffic.thread as tf_threads
    thread = threading.Thread(target=navigate, args=(agent, car))
    tf_threads.carla_threads.append(thread)
    thread.start()

    rental_obj = Rental.objects.get(id=rental.id)
    serialized_rental = serializers.serialize('json', [ rental_obj, ])
    return Response(serialized_rental, status=status.HTTP_200_OK)
def navigate(agent, vehicle):
    while True:
        if agent.done():
            print("The target has been reached, stopping the simulation")
            break
        vehicle.apply_control(agent.run_step())

@api_view(['PUT'])
def return_vehicle(request, id):
    active_status = "False"
    Rental.objects.filter(id=id).update(is_active=active_status)
    vehicle_obj = Rental.objects.get(id=id)
    serialized_vehicle = serializers.serialize('json', [ vehicle_obj, ])
    return Response(serialized_vehicle, status=status.HTTP_200_OK)

@api_view(['PUT'])
def updateAVSummary(request, id):
    distance = request.data["distance"]
    duration = request.data["duration"]
    active_status = request.data["active_status"]
    time_finished = request.data["time_finished"]

    Rental.objects.filter(id=id).update(distance=distance, duration=duration, active_status=active_status, time_finished=time_finished)
    vehicle_obj = Rental.objects.get(id=id)
    serialized_vehicle = serializers.serialize('json', [ vehicle_obj, ])
    return Response(serialized_vehicle, status=status.HTTP_200_OK)


@api_view(['GET'])
def getRentalStatus(request, id):
    process_status = Rental.objects.filter(id=id).only("process")
    serialized_vehicle_process_status = serializers.serialize('json', process_status)
    return HttpResponse(serialized_vehicle_process_status, content_type='application/json')

""""
select * from api_vehicle A INNER JOIN api_rental B ON A.id = B.vehicle_id_id;
"""
@api_view(['GET'])
def getUserRentalHistory(request, id):

    list_of_vehicles=Rental.objects.filter(id=id, active_status=False).select_related("vehicle_id").only("vehicle_id_id__name","vehicle_id_id__make", "vehicle_id_id__color", "time_started", "time_finished", "duration", "distance")
    # get_vehicle_info = Vehicle.objects.filter(id=id)
    serialized_rental_history = RentalVehicleSerializer(list_of_vehicles, many=True)
   
    # serialized_vehicle_rent = serializers.serialize('json', list_of_vehicles)
    # serialized_vehicle_list = serializers.serialize('json', get_vehicle_info)

    return Response (serialized_rental_history.data, status=status.HTTP_200_OK)



"""
select * from api_vehicle A INNER JOIN api_rental B ON A.id = B.vehicle_id_id 
Where A.status = "connected" and B.active_status = "False"
"""
@api_view(['GET'])
def getAVStatus(request):
    # Select_related is how to use a LEFT JOIN
    # print(f'Query test is: {Rental.objects.all().select_related("vehicle_id").query }')
    # print(f'Query test is: {Rental.objects.filter(vehicle_id__status="connected").filter(active_status="f").query }')
    list_of_vehilces=Rental.objects.filter(vehicle_id__status="connected").filter(active_status="f") 
    # print(f'Query test is: {Rental.objects.filter(vehicle_id__status="connected").query }')

    serialized_vehicle = serializers.serialize('json', list_of_vehilces, content_type='application/json')
    return Response(serialized_vehicle, status=status.HTTP_200_OK)

keyavID = "vehicle_id"
keyStatus = 'status'
def getServiceHistory(request): 
    # get the dictionary from httpRequest->QueruDict
    # QueryDict.get(key, default=None)
    avID = request.GET.get(keyavID, 1)
    print("getservice")
    avServiceHistory = MaintenanceRecord.objects.filter(vehicle_id = avID)
    if avServiceHistory.exists():
        return httpResponse_from_queryset(avServiceHistory)
    else :
        return  HttpResponseNotFound('<h1>illegal request</h1>')

def addServiceRecord(request): 
    # POST
    avID = request.POST.get(keyavID, 1)
    av = Vehicle.objects.get(pk=avID)
    record_dict = request.POST.dict()
    record_dict[keyavID] = av
    record = MaintenanceRecord.objects.create(**record_dict) # insert
    # retrun fullist
    return HttpResponse(serializers.serialize('json', MaintenanceRecord.objects.filter(vehicle_id = avID)), content_type='application/json')

@api_view(['GET'])
def getAvailableAV(request): 
    avs = Vehicle.objects.filter(status = 'Active')
    thequeryset_json = serializers.serialize('json', avs, fields=('make', 'color', 'name'))
    return HttpResponse(thequeryset_json, content_type='application/json')

@api_view(['POST'])
def updateAVstatus(request): 
    avID = request.data["id"]
    newstatus = request.data["status"]
    av_row_match = Vehicle.objects.filter(pk = avID).update(status = newstatus)
    if av_row_match > 0 :
        return  HttpResponse('AV status Updated')
    else:
        return HttpResponseBadRequest('No AV updated')

def getAllAV(request): 
    avs = Vehicle.objects.all()
    print(avs)
    thequeryset_json = serializers.serialize('json', avs)
    return HttpResponse(thequeryset_json, content_type='application/json')

def carlaUpdate(request): 
    avID = request.GET.get(keyavID, 1)
    car = get_carla_car_obj (avID)
    car3dv = car.get_velocity()
    cartransform = car.get_transform()

    return_data = {
        'speed':  (3.6 * math.sqrt(car3dv .x**2 + car3dv .y**2 + car3dv .z**2)),  # km/h
        'location': {
            'x': cartransform.location.x,
            'y': cartransform.location.y
        }
    }
    return HttpResponse(json.dumps(return_data), status=status.HTTP_200_OK)

# utility function
def httpResponse_from_queryset (thequeryset) :
    thequeryset_json = serializers.serialize('json', thequeryset)
    return HttpResponse(thequeryset_json, content_type='application/json')

def get_carla_car_obj (vehicle_id):
    vehicle_obj = Vehicle.objects.get(id=vehicle_id)
    vehicle_name = vehicle_obj.name
    client = Client.instance()
    world = client.get_world()
    
    all_cars = world.get_actors().filter("vehicle.*")
    carla_car = [car for car in all_cars if car.attributes.get("role_name") == vehicle_name]
    if len(carla_car) != 1:
        return Response("Error: Can't find the vehicle you want to rent", status=status.HTTP_400_BAD_REQUEST)
    
    return carla_car[0]