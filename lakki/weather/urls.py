from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url('stuff', views.dialogFlowRequestHandler, name='dialogFlowRequestHandler'),
    url('audio', views.dialogFlowAudioHandler, name='dialogFlowAudioHandler'),
]
