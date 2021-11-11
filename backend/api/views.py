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

def mark_available(request):
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

def mark_unavailable(request):
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

def rent_vehicle(request):
    pass

def return_vehicle(request):
    pass