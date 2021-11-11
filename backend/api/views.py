from django.shortcuts import render
from django.http import HttpResponse
from .models import *
# Create your views here.

def homepage(request):
    print("inside homepage")
    # return HttpResponse("<h1>This is vehicle rental homepage</h1>")
    return render(request, "homepage.html")


def add_vehicle(request):
    make = request.POST.get("Make")
    model = request.POST.get("Model")
    year = request.POST.get("Year")
    color = request.POST.get("Color")
    created_on = request.POST.get("Date")
    is_available = request.POST.get("AvailableFlag")
    vehicle = Vehicle(make=make, model=model, year=year, color=color, created_on=created_on, is_available=is_available)
    vehicle.save()
    return HttpResponse("<h1>Added Vehicle</h1>")
""""
    This is how you handle a GET request
"""
# def add_vehicle(request, make, model, year, color, created_on, is_deleted):
#     vehicle = Vehicle(make=make, model=model, year=year, color=color, created_on=created_on, is_deleted=is_deleted)
#     vehicle.save()
#     return HttpResponse("<h1>Added Vehicle</h1>")

def remove_vehicle(request, id):
    vehicle_obj = Vehicle.objects.get(id=id)
    vehicle_obj.delete()
    return HttpResponse("<h1>Rwmove vehicle</h1>")

def mark_available(request, id):
    availability = "True"
    vehicle_obj = Vehicle.objects.filter(id=id).update(is_available=availability)
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

def mark_unavailable(request, id):
    availability = "False"
    vehicle_obj = Vehicle.objects.filter(id=id).update(is_available=availability)
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

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
 