from django.urls import path
from .views import QuizView

app_name = "quiz"

urlpatterns = [
    path("", QuizView.as_view(), name="quiz-new"),
    path("<str:quiz_id>", QuizView.as_view(), name="quiz")
]
