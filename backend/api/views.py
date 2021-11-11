from django.shortcuts import render
from django.http import HttpResponse
from .models import *
# Create your views here.

def homepage(request):
    print("inside homepage")
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

def add_vehicle(request, make, model, year, color, created_on, is_deleted):
    vehicle = Vehicle(make=make, model=model, year=year, color=color, created_on=created_on, is_deleted=is_deleted)
    vehicle.save()
    return HttpResponse("<h1>Added Vehicle</h1>")

def remove_vehicle(request):
    return HttpResponse("<h1>Rwmove vehicle</h1>")

def mark_available(request):
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

def mark_unavailable(request):
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

def rent_vehicle(request):
    pass

def return_vehicle(request):
    pass