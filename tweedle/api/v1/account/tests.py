from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
from rest_framework_simplejwt.tokens import AccessToken

from .models import Account, Trophy

class MockRequests:
    class MockResponse:
        def json(self):
            return {"countryCode":"TES"}

    def get(self, *args):
        return self.MockResponse()

@patch("v1.middleware.requests", new=MockRequests())
class TokenViewTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user("testid")
        cls.account = Account.objects.create(user=cls.user,
                        handle="testhandle",
                        picture="http://test.com/test.png",
                        points=0,
                        country_code="TES")
    
    @patch("v1.account.views.getFirebaseUser")
    def test_account_signin_existing(self, mock):

        mock.return_value = {"userid":"testid",
            "handle":"testhandle","picture":"http://test.com/test.png"}

        url = reverse("account:account-signin")
        response = self.client.post(url, {"token":"testtoken"})
        json = response.json()

        self.assertIn("access", json)
        self.assertIn("refresh", json)

        access = AccessToken(json["access"])

        self.assertEqual(access.payload["id"], self.user.id)
        self.assertEqual(access.payload["handle"], self.account.handle)
        self.assertEqual(access.payload["picture"], self.account.picture)

    @patch("v1.account.views.getFirebaseUser")
    def test_account_signin_new(self, fb_mock):
        test_id = "testid2"
        test_handle = "testhandle2"
        test_picture = "http://test.com/test2.png"
        test_country = "TES"

        fb_mock.return_value = {"userid":test_id,
            "handle":test_handle,"picture":test_picture}

        url = reverse("account:account-signin")
        response = self.client.post(url, {"token":"testtoken"})
        json = response.json()

        self.assertIn("access", json)
        self.assertIn("refresh", json)

        access = AccessToken(json["access"])

        user = User.objects.get(username=test_id)
        account = user.account

        self.assertEqual(access.payload["id"], user.id)
        self.assertEqual(access.payload["handle"], test_handle)
        self.assertEqual(access.payload["picture"], test_picture)
        self.assertEqual(account.country_code,test_country)


@patch("v1.middleware.requests", new=MockRequests())
class AccountViewTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user_1 = User.objects.create_user("user_1")
        user_2 = User.objects.create_user("user_2")
        user_3 = User.objects.create_user("user_3")

        cls.account_1 = Account.objects.create(user=user_1,
                        handle="testhandle1",
                        picture="http://test.com/test.png",
                        points=200,
                        country_code="TES")
        
        cls.account_2 = Account.objects.create(user=user_2,
                        handle="testhandle2",
                        picture="http://test.com/test.png",
                        points=100,
                        country_code="TES")
        
        cls.account_3 = Account.objects.create(user=user_3,
                        handle="testhandle3",
                        picture="http://test.com/test.png",
                        points=300,
                        country_code="TES")
        
        Trophy.objects.create(account=cls.account_3,points=100)
        Trophy.objects.create(account=cls.account_1,points=200)

    def test_list_accounts(self):
        url = reverse("account:account-list")

        response = self.client.get(url)
        json = response.json()

        self.assertEqual(len(json),3)
        self.assertIn("id",json[0])
        self.assertIn("handle",json[0])
        self.assertIn("picture",json[0])
        self.assertIn("points",json[0])
        self.assertIn("trophies",json[0])

        self.assertIn("points",json[0]["trophies"][0])

        self.assertEqual(json[0]["points"],self.account_3.points)
    
    def test_retrieve_account(self):
        url = reverse("account:account-detail",args=["testhandle1"])

        response = self.client.get(url)
        json = response.json()


        self.assertIn("id",json)
        self.assertIn("handle",json)
        self.assertIn("picture",json)
        self.assertIn("points",json)
        self.assertIn("trophies",json)
        self.assertIn("likes",json)

        self.assertIn("points",json["trophies"][0])

        self.assertIn("ranks",json)
        self.assertEqual(len(json["ranks"]),3)

        self.assertIn("id",json["ranks"][0])
        self.assertIn("rank",json["ranks"][0])
        self.assertIn("handle",json["ranks"][0])
        self.assertIn("picture",json["ranks"][0])
        self.assertIn("points",json["ranks"][0])
        self.assertIn("trophies",json["ranks"][0])

        self.assertIn("points",json["ranks"][0]["trophies"][0])

        self.assertEqual(json["ranks"][1]["handle"],self.account_1.handle)
        self.assertEqual(json["ranks"][1]["points"],self.account_1.points)


    def test_like(self):
        url = reverse("account:account-like", args=[self.account_1.handle])
        user = self.account_1.user
        self.client.force_authenticate(user=user)

        response = self.client.patch(url,{"like": True})
        json = response.json()

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn("likes", json)
        self.assertTrue(json["likes"])

    def test_likes_count(self):
        self.account_1.likes = True
        self.account_1.save()

        url = reverse("account:account-likes")
        response = self.client.get(url)
        json = response.json()

        self.assertIn("likes_count", json)
        self.assertEqual(json["likes_count"],2)
