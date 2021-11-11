from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

import json

# Create your views here.
@api_view(['POST'])
def signup(request):
    return Response({"hello": "world"})
