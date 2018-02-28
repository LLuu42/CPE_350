from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
import json
import commands
import unirest
import requests

def home(request):
	return render(request, 'home.html')

def printInfo(request):
    #print dir(request.user.is_authenticated())
    print dir(request.user)
    print dir(request)
    return HttpResponse("hi")
