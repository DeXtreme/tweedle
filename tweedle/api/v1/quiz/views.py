from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.core.cache import cache
import tweepy as tw
from pprint import pprint
from uuid import uuid4
from random import choice


class QuizView(APIView):
    def get(self,request,*args,**kwargs):
        account = request.user.account
        country_code = account.country_code

        auth = tw.OAuth2AppHandler(
            settings.TWEEPY_ACCESS_TOKEN, 
            settings.TWEEPY_SECRET_TOKEN
        )

        api = tw.API(auth)

        places = api.search_geo(query=country_code, granularity="country")
        place_id = places[0].id
        tweets = api.search_tweets(
            q=f"place:{place_id} (min_faves:500 OR min_retweets:500)",
            result_type="mixed",
            count=100,tweet_mode="extended"
        )

        quiz = {}
        quiz["id"] = uuid4()
        quiz["lives"] = 3
        quiz["points"] = 0
        quiz["over"] = False
        
        questions = []
        while len(questions) < 10:
            #gen = choice([self._gen_who_tweeted,self._gen_who_is_this])
            gen = choice([self._gen_who_tweeted])
            question = gen(tweets)

            if question:
                questions.append(question)

        quiz["questions"] = questions

        if questions:
            cache.set(quiz["id"], quiz, 3600)

            question = quiz["questions"][0]

            data = {
                "id": quiz["id"],
                "lives": quiz["lives"],
                "over": quiz["over"],
                "points": quiz["points"],
                "question": {
                    "id": question["id"],
                    "type": question["type"],
                    "pre": question["pre"],
                    "choices": question["choices"]
                }
            }

            return Response(data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    

    def post(self,request,quiz_id,*args,**kwargs):

        choice = request.data["choice"]

        quiz = cache.get(quiz_id)
        
        if not quiz:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        questions = quiz["questions"]
        answer = questions[0]["answer"]
        question = None

        over = False

        if answer == choice:
            quiz["points"] += 10
        else:
            quiz["lives"] -= 1

        questions.pop(0)

        if len(questions) == 0 or quiz["lives"] == 0:
            over = True
            cache.delete(quiz_id)
        else:   
            question = questions[0]
            cache.set(quiz_id, quiz)

        data = {
            "answer": answer,
            'quiz': {
                "id": quiz["id"],
                "lives": quiz["lives"],
                "over": over,
                "points": quiz["points"],
            }
        }

        if question:
            data["quiz"]["question"] = {
                "id": question["id"],
                "type": question["type"],
                "pre": question["pre"],
                "choices": question["choices"]
            }
        
        return Response(data)
            

    def _gen_who_tweeted(self,tweets):
        for _ in range(5):
            question = {}
            tweet = choice(tweets)

            if tweet.in_reply_to_status_id is not None:
                continue
            
            question["id"] = uuid4()
            question["type"] = 1
            question["pre"]= {"text": tweet.full_text,"media":[]}
            if "media" in tweet.entities:
                question["pre"]["media"] = list(map(
                    lambda media: {
                        "type": media["type"],
                        "url": media["media_url"]
                    }, tweet.entities["media"]))

            question["answer"] = tweet.user.screen_name

            choices = {
                tweet.user.screen_name: tweet.user.profile_image_url
            }

            while len(choices) < 3:
                rnd_tweet = choice(tweets)
                choices[rnd_tweet.user.screen_name] = rnd_tweet.user.profile_image_url
            
            question["choices"] = choices

            return question
    
    def _gen_who_is_this(self,tweets):
        question = {}

        tweet = choice(tweets)

        question["id"] = uuid4()
        question["type"] = 2
        question["pre"]= {"picture": tweet.user.profile_image_url}
        question["answer"] = tweet.user.screen_name
        choices = [tweet.user.screen_name]

        while len(choices) < 3:
            rnd_tweet = choice(tweets)
            if rnd_tweet.user.screen_name not in choices:
                choices.append(rnd_tweet.user.screen_name)
        
        question["choices"] = choices

        return question

       





    



