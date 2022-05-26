from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.urls import reverse

from v1.account.models import Account

class QuizTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user("testid")
        cls.account = Account.objects.create(user=cls.user,
                        handle="testhandle",
                        picture="http://test.com/test.png",
                        points=0,
                        country_code="GH")

    def test_new_quiz(self):
        url = reverse("quiz:quiz-new")

        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        json = response.json()

        print(json)

        self.assertIn("id", json)
        self.assertIn("over", json)
        self.assertIn("lives", json)
        self.assertIn("question", json)
        self.assertIn("id", json["question"])
        self.assertIn("type", json["question"])
        self.assertIn("pre", json["question"])
        self.assertIn("choices", json["question"])


        