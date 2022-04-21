from django.urls import path
from .views import TokenView

app_name = "account"
urlpatterns = [
    path("token/", TokenView.as_view(), name="account-signin"),
]