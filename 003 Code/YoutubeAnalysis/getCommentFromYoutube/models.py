from django.db import models


# Create your models here.

#https://yerinpy73.tistory.com/14
class Url(models.Model):
    url = models.CharField(max_length=100)

    #객체 이름 = 링크
    def __str__(self):
        return self.url