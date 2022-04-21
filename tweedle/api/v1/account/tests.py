from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from unittest.mock import patch
from rest_framework_simplejwt.tokens import AccessToken

from .models import Account

class AccountViewTestCase(APITestCase):
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

    @patch("v1.account.views.requests")
    @patch("v1.account.views.getFirebaseUser")
    def test_account_signin_new(self, fb_mock, req_mock):
        test_id = "testid2"
        test_handle = "testhandle2"
        test_picture = "http://test.com/test2.png"
        test_country = "TES"

        fb_mock.return_value = {"userid":test_id,
            "handle":test_handle,"picture":test_picture}
        
        class Response:
            def json(self):
                return {"country":test_country}

        req_mock.get.return_value = Response()

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


    

