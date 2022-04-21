import os,json
import firebase_admin
from firebase_admin import auth

def getFirebaseUser(token):
    """Get Firebase user details
    
    Parameters
    ==========

    token: str
        The token provided by firebase after sigin

    Returns
    =======
    dict
        uid: str
            The userId of the user
        name: str
            The display name of the user
        photourl: str
            A link to the user photo
    """
    credential = json.loads(os.environ.get("FIREBASE_CREDENTIALS","{}"))
    firebase_admin.initialize_app(credential=credential)
    claims = auth.verify_id_token(token)
    userid = claims["uid"]
    fb_user = auth.get_user(userid)

    handle= fb_user.display_name
    picture = fb_user.photo_url

    return {"userid": userid, "handle": handle, "picture": picture}