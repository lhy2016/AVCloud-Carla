import webbrowser

from flask import Flask
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_user import UserManager
from flask_login import LoginManager

from config import config_by_name

import flickrapi

db = SQLAlchemy()
flask_bcrypt = Bcrypt()
login_manager = LoginManager()
mail = Mail()
flickr = flickrapi.FlickrAPI(config_by_name["FLICKR_KEY"], config_by_name["FLICKR_SECRET"], token_cache_location='./')

if not flickr.token_valid(perms='delete'):
    # Get a request token
    flickr.get_request_token(oauth_callback='oob')

    # Open a browser at the authentication URL. Do this however
    # you want, as long as the user visits that URL.
    authorize_url = flickr.auth_url(perms='delete')
    webbrowser.open_new_tab(authorize_url)

    # Get the verifier code from the user. Do this however you
    # want, as long as the user gives the application the code.
    verifier = str(input('Verifier code: '))

    flickr.get_access_token(verifier)

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    flask_bcrypt.init_app(app)
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    app.register_blueprint(bp)
    from app.models import User
    user_manager = UserManager(app, db, User)
    login_manager.login_view = ""
    return app

from app.api import bp
