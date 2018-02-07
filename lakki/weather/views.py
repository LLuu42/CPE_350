# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse, JsonResponse
import json
import commands
import unirest
import requests

def index(request):
    return render(request, "index.html", {})
    #return render(request, loader.get_template('index.html'))

def dialogFlowRequestHandler(request):
    gcloud_access_token = commands.getstatusoutput('gcloud auth print-access-token')[1]

    if (request.method == 'POST'):
        print request.POST['input']
        parameters = json.dumps({'queryInput':{'text':{'text': request.POST['input'], 'languageCode':'en'}}})
        url = "https://dialogflow.googleapis.com/v2beta1/projects/local-circuit-181715/agent/sessions/fa80a7e4-ba2c-4465-a516-b8d2c6ea950f:detectIntent"
        #print form_data
        headers={"Accept": "application/json; charset=utf-8", "Authorization": "Bearer " + gcloud_access_token}
        response = requests.post(url, headers = headers, data = parameters)
        return JsonResponse(response.json())
    else:
        return HttpResponse("Incorrect http method", status=405);
