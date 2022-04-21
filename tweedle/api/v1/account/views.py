import requests
from django.contrib.auth.models import User
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import AccountSerializer,SigninSerializer
from .models import Account
from v1.account.firebase import getFirebaseUser

class AccountView(GenericAPIView):

    serializer_class = AccountSerializer
    queryset = Account.objects.all()

    def get(self,request,*args,**kwargs):
        return Response()

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
            country = self.get_country(request)
            account = Account.objects.create(user=user,
                        handle=details["handle"],
                        picture=details["picture"],
                        points=0,
                        country_code=country)
            
        token = RefreshToken.for_user(user)
        token["handle"] = account.handle
        token["picture"] = account.picture
        
        return Response({
            "access": str(token.access_token),
            "refresh": str(token)
        })
            
    def get_country(self,request):
        print(request.META)
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[-1]
        else:
            ip = request.META.get("REMOTE_ADDR")
            
        response = requests.get(f"http://ip-api.com/json/{ip}",
                    {"fields":"country"})
        json = response.json()
        return json["country"]