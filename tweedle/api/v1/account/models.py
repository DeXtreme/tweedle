from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Window,F
from django.db.models.functions import window


class AccountRankingManager(models.Manager):
    def get(self, handle):
        account = get_object_or_404(self.get_queryset(),handle=handle)

        rankings = self.get_queryset()\
                        .filter(country_code=account.country_code)\
                        .order_by("-points")\
                        .annotate(rank=Window(
                            expression=window.RowNumber(),
                            order_by=F("points").desc()))

        sql, params = rankings.query.sql_with_params()

        account_rank =  self.get_queryset().raw("""
            SELECT * FROM ({}) rankings
            WHERE handle = %s
        """.format(sql),[*params, handle])[0].rank

        ranks = self.get_queryset().raw("""
            SELECT * FROM ({}) rankings
            WHERE rank <= %s AND rank >= %s
        """.format(sql),[*params, account_rank+2, account_rank-2])

        account.ranks = ranks

        return account


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
    likes : bool
        The user likes the tweedle tweet
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name="account")
    handle = models.CharField(max_length=15,blank=False)
    picture = models.URLField()
    points = models.IntegerField()
    country_code = models.CharField(max_length=5)
    likes = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()
    ranking = AccountRankingManager()

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