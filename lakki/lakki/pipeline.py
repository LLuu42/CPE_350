from .models import UserProfile

def save_profile(backend, response, details, user, *args, **kwargs):
    print "--------------------"
    print response
    print details
    print user
    print "--------------------"
