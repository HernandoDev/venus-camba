import os

# JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
JWT_SECRET_KEY = 'super_secret'

SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://venusdb:zFCSvrFtyAYT7@34.170.132.194:3306/venuscambadb'
CORS_HEADERS = 'Content-Type'
