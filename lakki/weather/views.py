# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.template import loader
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import HttpResponse, JsonResponse
import json, commands, unirest, requests, time, base64, ipdb, tempfile
from gtts import gTTS

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

def dialogFlowAudioHandler(request):
    gcloud_access_token = commands.getstatusoutput('gcloud auth print-access-token')[1]

    if (request.method == 'POST'):
        # #blob = request.POST['blob']
        blob = request.FILES['blob']
        blob.seek(0)
        encodedAudio = base64.b64encode(blob.read())

        audioConfig = {
            "audioEncoding": "AUDIO_ENCODING_LINEAR_16",
            "sampleRateHertz": 16000,
            "languageCode": 'en',
        }
        parameters = json.dumps({'queryInput' : {'audioConfig': audioConfig}, 'inputAudio' : encodedAudio})
        url = "https://dialogflow.googleapis.com/v2beta1/projects/local-circuit-181715/agent/sessions/fa80a7e4-ba2c-4465-a516-b8d2c6ea950f:detectIntent"
        headers={"Accept": "application/json; charset=utf-8", "Authorization": "Bearer " + gcloud_access_token}
        response = requests.post(url, headers = headers, data = parameters).json()
        print response
        text = ""
        if 'fulfillmentText' in response['queryResult']:
            text = response['queryResult']['fulfillmentText']
        else:
            text = "I could not understand that, please try again."
        soundfile = translateTextToSpeech(text)
        soundfile.seek(0)
        return JsonResponse({'mp3' : base64.b64encode(soundfile.read())})

def translateTextToSpeech(text):
    file = tempfile.TemporaryFile()
    tts = gTTS(text=text, lang='en', slow=False)
    tts.write_to_fp(file)
    return file
