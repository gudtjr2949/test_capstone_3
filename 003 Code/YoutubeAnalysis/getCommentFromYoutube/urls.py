from django.urls import path
from . import views


app_name = 'getCommentFromYoutube'
urlpatterns = [
    path('', views.inputSearchingUrl, name='inputSearchingUrl'),
    path('geturl/', views.getCommentsFromYoutube, name='getCommentsFromYoutube'),
]