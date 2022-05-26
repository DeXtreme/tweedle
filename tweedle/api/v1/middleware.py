from django.core.cache import cache
import requests

class CountryCodeMiddleware:
    """Middleware to add country code of IP to 
    request"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[-1]
        else:
            ip = request.META.get("REMOTE_ADDR")

        country_code = cache.get(ip)
        
        if not country_code:  
            try:
                response = requests.get(f"http://ip-api.com/json/{ip}",
                        {"fields":"countryCode"})
                json = response.json()
                country_code = json["countryCode"]
                cache.set(ip,country_code,3600)
            except Exception:
                pass
        else:
            cache.touch(ip,3600)

        request.country_code = country_code
        response = self.get_response(request)

        return response
