from django.db import models
from django.utils.timezone import now

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    create_on = models.DateTimeField(default=now)
    is_deleted = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    
    # array of objects: [{"vehicle_id": 1, "archived_on": formatted datetime string},...]
    archived_vehicles = models.JSONField()

class Vehicle(models.Model):
    is_active = models.BooleanField(default=True)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveSmallIntegerField()
    color = models.CharField(max_length=20)
    created_on = models.DateTimeField(default=now)
    is_available = models.BooleanField(default=False)

class Rental(models.Model):
    time_started = models.DateTimeField(default=now)
    time_finished = models.DateTimeField()
    user_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    vehicle_id = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True)
    distance = models.PositiveIntegerField()
    duration = models.PositiveIntegerField()
    active_status = models.BooleanField(default=False)