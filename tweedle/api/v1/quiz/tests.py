from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.urls import reverse
from django.core.cache import cache
from uuid import uuid4

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
        
    
    def setUp(self):
        self.quiz_id = uuid4()
        self.quiz = {
                "id": self.quiz_id,
                "lives": 3,
                "over": False,
                "points": 0,
                "questions": [
                    {"id": 1,
                    "type": "type",
                    "pre": "pre",
                    "choices": "choices",
                    "answer": "answer"},
                    {"id": 2,
                    "type": "type",
                    "pre": "pre",
                    "choices": "choices",
                    "answer": "answer"}
                ]
            }

        cache.set(self.quiz_id, self.quiz)
        return super().setUp()


    def test_new_quiz(self):
        url = reverse("quiz:quiz-new")

        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        json = response.json()

        self.assertIn("id", json)
        self.assertIn("over", json)
        self.assertIn("lives", json)
        self.assertIn("question", json)
        self.assertIn("id", json["question"])
        self.assertIn("type", json["question"])
        self.assertIn("pre", json["question"])
        self.assertIn("choices", json["question"])

    
    def test_answer_question(self):
        url = reverse("quiz:quiz",args=[self.quiz_id])

        self.client.force_authenticate(user=self.user)
        response = self.client.post(url,{"choice":"answer"})
        json = response.json()

        self.assertIn("answer",json)
        self.assertEqual(json["answer"], self.quiz["questions"][0]["answer"])
        self.assertIn("quiz",json)
        self.assertIn("id", json["quiz"])
        self.assertIn("over", json["quiz"])
        self.assertIn("points", json["quiz"])
        self.assertEqual(json["quiz"]["points"],10)
        self.assertIn("lives", json["quiz"])
        self.assertIn("question", json["quiz"])
        self.assertIn("id", json["quiz"]["question"])
        self.assertEqual(json["quiz"]["question"]["id"], self.quiz["questions"][1]["id"])
        self.assertIn("type", json["quiz"]["question"])
        self.assertIn("pre", json["quiz"]["question"])
        self.assertIn("choices", json["quiz"]["question"])
    
    def test_answer_question_wrong(self):
        url = reverse("quiz:quiz",args=[self.quiz_id])

        self.client.force_authenticate(user=self.user)
        response = self.client.post(url,{"choice":"wronganswer"})
        json = response.json()

        self.assertIn("answer",json)
        self.assertEqual(json["answer"], self.quiz["questions"][0]["answer"])
        self.assertIn("quiz",json)
        self.assertIn("id", json["quiz"])
        self.assertIn("over", json["quiz"])
        self.assertIn("points", json["quiz"])
        self.assertEqual(json["quiz"]["points"],0)
        self.assertIn("lives", json["quiz"])
        self.assertIn("question", json["quiz"])
        self.assertIn("id", json["quiz"]["question"])
        self.assertEqual(json["quiz"]["question"]["id"], self.quiz["questions"][1]["id"])
        self.assertIn("type", json["quiz"]["question"])
        self.assertIn("pre", json["quiz"]["question"])
        self.assertIn("choices", json["quiz"]["question"])

    
    def test_game_over(self):
        url = reverse("quiz:quiz",args=[self.quiz_id])

        self.client.force_authenticate(user=self.user)
        response = self.client.post(url,{"choice":"wronganswer"})
        response = self.client.post(url,{"choice":"wronganswer"})
        
        json = response.json()

        self.assertIn("answer",json)
        self.assertEqual(json["answer"], self.quiz["questions"][1]["answer"])
        self.assertIn("quiz",json)
        self.assertIn("id", json["quiz"])
        self.assertIn("over", json["quiz"])
        self.assertTrue(json["quiz"]["over"])
        self.assertIn("points", json["quiz"])
        self.assertEqual(json["quiz"]["points"],0)
        self.assertIn("lives", json["quiz"])
        self.assertEqual(json["quiz"]["lives"],1)
    
    
    def tearDown(self):
        cache.delete(self.quiz_id)
        return super().tearDown()
        
        