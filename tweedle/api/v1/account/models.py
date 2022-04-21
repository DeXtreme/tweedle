from argparse import ONE_OR_MORE
from django.contrib.auth.models import User
from django.db import models

class Account(models.Model):
    """Account model
    
    Attributes
    ==========
    user: User
        Django user model
    handle: str
        The account twitter handle
    picture: str
        The account twitter profile picture
        url
    points: int
        The scored points
    country: str
        The country code of the account
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name="account")
    handle = models.CharField(max_length=15,blank=False)
    picture = models.URLField()
    points = models.IntegerField()
    country_code = models.CharField(max_length=5)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"@{self.handle}"
    

class Trophy(models.Model):
    """Trophy model
    
    Attributes
    ==========
    account: Account
        The account that won the trophy
    points: int
        The points scored
    """

    account = models.ForeignKey(Account,on_delete=models.CASCADE,
                related_name="trophies")
    points = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)