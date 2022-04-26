from django.contrib.auth.models import User
from django.db.models import Window, Subquery
from django.db.models.functions import window
from rest_framework.viewsets import GenericViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import AccountSerializer,SigninSerializer
from .models import Account
from v1.account.firebase import getFirebaseUser

from .serializers import LeaderboardSerializer

class AccountView(GenericViewSet):

    permission_classes = ()
    authentication_classes = ()
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    lookup_field = "handle"

    def list(self, request, *args, **kwargs):
        country_code = request.country_code
        accounts = self.get_queryset().filter(country_code=country_code)\
            .order_by("-points")
        serializer = LeaderboardSerializer(accounts,many=True)
        return Response(serializer.data)

    
    def retrieve(self, request, handle, *args, **kwargs):
        account = Account.ranking.get(handle)
        serializer = self.get_serializer_class()(account)

        return Response(serializer.data)
        

class TokenView(APIView):
    permission_classes = ()
    authentication_classes = ()

    def post(self, request, *args, **kwargs):
        serializer = SigninSerializer(data=request.data)
        serializer.is_valid()
        token = serializer.validated_data["token"]

        try:
            details = getFirebaseUser(token)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=details["userid"])
            account = Account.objects.get(user=user)
            account.handle = details["handle"]
            account.picture = details["picture"]
            account.save()
        except User.DoesNotExist:
            user = User.objects.create_user(details["userid"])
            country_code = request.country_code
            account = Account.objects.create(user=user,
                        handle=details["handle"],
                        picture=details["picture"],
                        points=0,
                        country_code=country_code)
            
        token = RefreshToken.for_user(user)
        token["handle"] = account.handle
        token["picture"] = account.picture
        
        return Response({
            "access": str(token.access_token),
            "refresh": str(token)
        })