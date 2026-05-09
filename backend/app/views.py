from django.shortcuts import render, HttpResponse

# Create your views here.
def home(req):
    return HttpResponse('<h1>Hello sai</h1>') 