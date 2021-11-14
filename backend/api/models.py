from django.db import models
from django.utils.timezone import now
from user.models import User

# Create your models here.

class Vehicle(models.Model):

    # is_active = models.BooleanField(default=True)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveSmallIntegerField()
    color = models.CharField(max_length=20)
    created_on = models.DateTimeField(default=now)
    # is_available = models.BooleanField(default=False)

    status = models.TextField (max_length=20, default='Active')

class Rental(models.Model):
    time_started = models.DateTimeField(default=now)
    time_finished = models.DateTimeField()
    user_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    vehicle_id = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True)
    distance = models.PositiveIntegerField()
    duration = models.PositiveIntegerField()
    active_status = models.BooleanField(default=False)

class MaintenanceRecord(models.Model):
    record_id = models.AutoField(primary_key=True)
    vehicle_id = models.ForeignKey(Vehicle, on_delete=models.CASCADE,default=0)
    date = models.DateTimeField(default=now)
    detail = models.TextField(max_length=200, default='')