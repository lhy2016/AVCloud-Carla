from django.core.serializers import serialize
from rest_framework import serializers
from .models import Rental, User, Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ('id', 'name', 'make', 'color', 'created_on')

class RentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental
        fields = ('id', 'time_started', 'time_finished', 'distance', 'duration')

class RentalVehicleSerializer(serializers.ModelSerializer):
    vehicle_id_name = serializers.SerializerMethodField()
    vehicle_id_make = serializers.SerializerMethodField()
    vehicle_id_color = serializers.SerializerMethodField()
    vehicle_id_created_on = serializers.SerializerMethodField()

    def get_vehicle_id_name(self, obj):
        return obj.vehicle_id.name

    def get_vehicle_id_make(self, obj):
        return obj.vehicle_id.make

    def get_vehicle_id_color(self, obj):
        return obj.vehicle_id.color
    
    def get_vehicle_id_created_on(self, obj):
        return obj.vehicle_id.created_on

    class Meta:
        model = Rental
        fields = '__all__' 