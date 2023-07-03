import os

# JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
JWT_SECRET_KEY = 'super_secret'

SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://docker_root:docker_root@mysql-qsm:3306/ventudb'
CORS_HEADERS = 'Content-Type'
