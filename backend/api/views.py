from django.shortcuts import render
from django.http import HttpResponse
from .models import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core import serializers
from datetime import datetime

# Create your views here.

def homepage(request):
    print("inside homepage")
    # return HttpResponse("<h1>This is vehicle rental homepage</h1>")
    # return render(request, "homepage.html")
    return render(request, "rent_vehicle.html")

@api_view(['POST'])
def add_vehicle(request):
    make = request.POST.get("Make")
    model = request.POST.get("Model")
    year = request.POST.get("Year")
    color = request.POST.get("Color")
    created_on = request.POST.get("Date")
    is_available = request.POST.get("AvailableFlag")

    created_on = datetime.strptime(created_on, '%Y-%m-%d').isoformat()
    vehicle = Vehicle(make=make, model=model, year=year, color=color, created_on=created_on, is_available=is_available)
    vehicle.save()
    vehicle_obj = Vehicle.objects.get(id=vehicle.id)
    serialized_vehicle = serializers.serialize('json', [ vehicle_obj, ])
    print(f"Serialized is: {serialized_vehicle}")
    return Response(serialized_vehicle, status=status.HTTP_200_OK)
""""
    This is how you handle a GET request
"""
# def add_vehicle(request, make, model, year, color, created_on, is_deleted):
#     vehicle = Vehicle(make=make, model=model, year=year, color=color, created_on=created_on, is_deleted=is_deleted)
#     vehicle.save()
#     return HttpResponse("<h1>Added Vehicle</h1>")

@api_view(['GET'])
def remove_vehicle(request, id):
    vehicle_obj = Vehicle.objects.get(id=id)
    vehicle_obj.delete()
    serialized_vehicle = serializers.serialize('json', [ vehicle_obj, ])
    return Response(serialized_vehicle, status=status.HTTP_200_OK)

@api_view(['GET'])
def mark_available(request, id):
    availability = "True"
    vehicle_obj = Vehicle.objects.filter(id=id).update(is_available=availability)
    serialized_vehicle = serializers.serialize('json', [ vehicle_obj, ])
    return Response(serialized_vehicle, status=status.HTTP_200_OK)

@api_view(['GET'])
def mark_unavailable(request, id):
    availability = "False"
    vehicle_obj = Vehicle.objects.filter(id=id).update(is_available=availability)
    serialized_vehicle = serializers.serialize('json', [ vehicle_obj, ])
    return Response(serialized_vehicle, status=status.HTTP_200_OK)

def rent_vehicle(request):
    time_started = request.POST.get('time_started')
    time_finished = request.POST.get('time_finished')
    distance = request.POST.get('distance')
    duration = request.POST.get('duration')
    user_id_id = request.POST.get('user_id_id')
    vehicle_id_id = request.POST.get('vehicle_id_id')
    active_status = request.POST.get('active_status')

    rental_vehicle = Rental(time_started=time_started, time_finished=time_finished, distance=distance, duration=duration,
    user_id_id=user_id_id, vehicle_id_id=vehicle_id_id, active_status=active_status)
    rental_vehicle.save()
    return HttpResponse("<h1>Vehicle is rented</h1>")


def return_vehicle(request, id):
    active_status = "False"
    rental_vehicle = Rental.objects.filter(id=id).update(is_active=active_status)
    return HttpResponse("<h1>Car has been returned</h1>")
 