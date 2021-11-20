from django.contrib import admin
from django.urls import path
from . import views


urlpatterns = [
    #^$ means this is the default homepage page of the section..
    #/homepage/
    path('', views.homepage, name="homepage"),
    path('add_vehicle', views.add_vehicle, name="add_vehicle"),
    
    path('remove/<int:id>', views.remove_vehicle, name="remove_vehicle"),
    path('markAvailable/<int:id>', views.mark_available, name="mark_available"),
    path('markUnavailable/<int:id>', views.mark_unavailable, name="mark_unavailable"),
    path('rent_vehicle', views.rent_vehicle, name="rent_vehicle"),
    path('return_vehicle/<int:id>', views.return_vehicle, name="return_vehicle"),
    path('getServiceHistory/', views.getServiceHistory, name = 'get-service-history'), 
    path('getProcessStatus/<int:id>', views.getProcessStatus, name = 'get-process-status'), 
    path('addServiceRecord/', views.addServiceRecord, name = 'add-service-record'),
    path('getAvailableAV/', views.getAvailableAV, name = 'get-available-av'), 
    path('updateAVstatus/', views.updateAVstatus, name = 'update-av-status'),
    path('updateAVSummary/<int:id>', views.updateAVSummary, name = 'update-av-summary'),
    path('getAllAV/', views.getAllAV, name = 'get-all-av'),
    path('getAVStatus/', views.getAVStatus, name='get-av-status'),
    path('getUserRentalHistory/<int:id>', views.getUserRentalHistory, name='user-rented-vehicles'),
    path('carlaUpdate/', views.carlaUpdate, name = 'update-carla-data'),

]
