from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def homepage(request):
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

def add_vehicle(request):
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

def remove_vehicle(request):
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

def add_vehicle(request):
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

def mark_available(request):
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")

def mark_unavailable(request):
    return HttpResponse("<h1>This is vehicle rental homepage</h1>")