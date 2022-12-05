from django.db import models


class Comment(models.Model):
    id = models.CharField(max_length=15, primary_key=True)
    per = models.FloatField()
    good_top5 = models.TextField()
    bad_top5 = models.TextField()
    keyword = models.TextField()
