from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User
import json

# Create your views here.
@api_view(['POST'])
def signup(request):
    query_object = request.data
    num_existing_user = User.objects.filter(username=query_object['username']).count()
    if (num_existing_user == 1):
        return Response({"error": "username already existed"}, status=status.HTTP_400_BAD_REQUEST)
    hashed_password = query_object['password']
    query_object['password'] = hashed_password
    query_object['archived_vehicles'] = []
    user = User(**query_object)
    user.save()
    new_user = query_object.copy()
    del new_user["password"]
    return Response(new_user, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login(request):
    ret = {}
    query_object = request.data
    username = query_object['username']
    password = query_object['password']
    num_existing_user = User.objects.filter(username=username).count()
    if num_existing_user == 1:
        
        user = User.objects.get(username=username)
        actual_password = user.password
        
        if password == actual_password:
            ret["user"] = username
            return Response(ret, status=status.HTTP_200_OK)
    return Response({"error": "Incorrect username or password"}, status=status.HTTP_400_BAD_REQUEST)


