from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('board/', views.board, name='board'),
    path('board/<str:qudgns>', views.board)
    # path('board/<word>/', views.board, name='board')
]