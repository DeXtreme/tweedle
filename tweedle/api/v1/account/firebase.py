import os,json
import firebase_admin
from firebase_admin import auth, credentials


credentials_dict = json.loads(os.environ.get("FIREBASE_CREDENTIALS","{}"))
certificate = credentials.Certificate(credentials_dict)
firebase_admin.initialize_app(credential=certificate)


def getFirebaseUser(token):
    """Get Firebase user details
    
    Parameters
    ==========

    token: str
        The token provided by firebase after sigin

    Returns
    =======
    dict
        userid: str
            The userId of the user
        handle: str
            The display name of the user
        picture: str
            A link to the user photo
    """
    claims = auth.verify_id_token(token)
    userid = claims["uid"]
    fb_user = auth.get_user(userid)
    handle= fb_user.display_name
    picture = fb_user.photo_url

    return {"userid": userid, "handle": handle, "picture": picture}