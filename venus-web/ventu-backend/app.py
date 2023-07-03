from flask import Flask
from flask_cors import CORS
from utilities import database, schemas, jwt, migrations
from sqlalchemy_utils import database_exists
import logging
import os
from common.controllers import common
from src.productos.views import productos
from src.usuarios.controllers import usuarios
from src.eventos.views import eventos
from src.invitados.views import invitados
from src.landing.views import landing
from src.categorias_invitados.views import categorias_invitados
from src.planes.views import planes


def create_app(config_file='settings.py'):
    app = Flask(__name__)
    app.config.from_pyfile(os.path.join('environments', config_file))
    CORS(app)
    jwt.init_app(app)
    config_database(app)
    config_modules(app)
    config_logs()
    app.route("/")(check_status)
    # Thread(target=launch_schedules).start()
    logging.info('\n* Server was started succesfully *\n')
    return app

def config_modules(app):
    app.register_blueprint(usuarios)
    app.register_blueprint(common, url_prefix='/common')
    app.register_blueprint(productos, url_prefix='/producto')
    app.register_blueprint(eventos, url_prefix='/evento')
    app.register_blueprint(invitados, url_prefix='/lista_invitados')
    app.register_blueprint(landing, url_prefix='/landing')
    app.register_blueprint(categorias_invitados, url_prefix='/categorias_invitados')
    app.register_blueprint(planes, url_prefix='/planes')
def config_database(app):
    if database_exists(app.config["SQLALCHEMY_DATABASE_URI"]):
        database.init_app(app)
        schemas.init_app(app)
        migrations.init_app(app, database)
    else:
        raise Exception("Database not found")

def config_logs():
    logging.basicConfig(filename='nohup.log',level=logging.INFO)    
    werkzeug_logs = logging.getLogger('werkzeug')
    werkzeug_logs.setLevel(logging.WARNING)

def check_status():
    logging.info('\n* Status was checked succesfully *\n')
    return "Ventu Rest API server is running..."

if __name__ == '__main__':
    app = create_app('settings.py')
    app.run(debug=False, host='0.0.0.0',port=5000)
