from django.urls import path
from .views import QuizView

app_name = "quiz"

urlpatterns = [
    path("", QuizView.as_view(), name="quiz-new"),
    path("<str:id>", QuizView.as_view(), name="quiz")
]
