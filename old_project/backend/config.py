import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import pymysql
import secrets

rootUrl = "http://127.0.0.1:5000/"
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

FLICKR_KEY = 'be92aac8043752b5dfdcee073bc88963'
FLICKR_SECRET = '82b464167bc2d1f9'

class Config:
    DEBUG = False


class DevelopmentConfig(Config):
    # uncomment the line below to use postgres
    # SQLALCHEMY_DATABASE_URI = postgres_local_base
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:lhy_2016@hf-db:3306/homefinder'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USE_TLS = False
    MAIL_USERNAME = 'team.12.homefinder@gmail.com'
    MAIL_PASSWORD = 'homefinder123'
    MAIL_DEFAULT_SENDER = 'team.12.homefinder@gmail.com'
    SECRET_KEY = 'test'


class ProductionConfig(Config):
    # uncomment the line below to use postgres
    # SQLALCHEMY_DATABASE_URI = postgres_local_base
    DEBUG = False


config_by_name = dict(dev=DevelopmentConfig, prod=ProductionConfig, FLICKR_KEY=FLICKR_KEY, FLICKR_SECRET=FLICKR_SECRET)