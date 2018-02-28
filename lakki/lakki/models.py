from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    email = models.CharField(max_length=255, blank=True)
    access_token = models.CharField(max_length=255, blank=True)
