from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User
from django.contrib.auth.hashers import make_password
import json

# Create your views here.
@api_view(['POST'])
def signup(request):
    query_object = request.data
    num_existing_user = User.objects.filter(username=query_object['username']).count()
    if (num_existing_user == 1):
        return Response({"error": "username already existed"}, status=status.HTTP_400_BAD_REQUEST)
    hashed_password = make_password(query_object['password'])
    query_object['password'] = hashed_password
    query_object['archived_vehicles'] = []
    user = User(**query_object)
    user.save()
    new_user = query_object.copy()
    del new_user["password"]
    return Response(new_user, status=status.HTTP_201_CREATED)
