from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    

    class Meta:
        model = User
        fields = ('id', 'username', 'create_on', 'is_deleted','is_admin','archived_vehicles')