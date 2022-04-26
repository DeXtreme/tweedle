from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TokenView,AccountView

app_name = "account"

router = DefaultRouter()
router.register("", AccountView, "account")

urlpatterns = [
    path("token/", TokenView.as_view(), name="account-signin"),
     *router.urls,
]
