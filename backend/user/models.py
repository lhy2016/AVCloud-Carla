from django.db import models
from django.utils.timezone import now
# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=500)
    create_on = models.DateTimeField(default=now)
    is_deleted = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    
    # array of objects: [{"vehicle_id": 1, "archived_on": formatted datetime string},...]
    archived_vehicles = models.JSONField()