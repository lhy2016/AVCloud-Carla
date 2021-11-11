from django.contrib import admin
from django.urls import path
from . import views


urlpatterns = [
    #^$ means this is the default homepage page of the section..
    #/homepage/
    path('', views.homepage, name="homepage"),
    path('add_vehicle/<str:make>/<str:model>/<str:year>/<str:color>/<str:created_on>/<str:is_deleted>', views.add_vehicle, name="add_vehicle"),
    path('remove', views.remove_vehicle, name="remove_vehicle"),
    path('markAvailable', views.mark_available, name="mark_available"),
    path('markUnavailable', views.mark_unavailable, name="mark_unavailable"),
    path('rent_vehicle', views.rent_vehicle, name="rent_vehicle"),
    path('return_vehicle', views.return_vehicle, name="return_vehicle")

]