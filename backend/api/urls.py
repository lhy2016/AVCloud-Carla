from django.contrib import admin
from django.urls import path
from . import views


urlpatterns = [
    #^$ means this is the default homepage page of the section..
    #/homepage/
    path('', views.homepage, name="homepage"),
    path('add_vehicle', views.add_vehicle, name="add_vehicle"),
    # This is how to do a GET REQUEST
    # path('add_vehicle/<str:make>/<str:model>/<str:year>/<str:color>/<str:created_on>/<str:is_deleted>', views.add_vehicle, name="add_vehicle"),
    path('remove/<int:id>', views.remove_vehicle, name="remove_vehicle"),
    path('markAvailable/<int:id>', views.mark_available, name="mark_available"),
    path('markUnavailable/<int:id>', views.mark_unavailable, name="mark_unavailable"),
    path('rent_vehicle', views.rent_vehicle, name="rent_vehicle"),
    path('return_vehicle/<int:id>', views.return_vehicle, name="return_vehicle")

]
