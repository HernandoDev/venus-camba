from utilities import database as db, add_schema
from datetime import datetime
import hashlib

from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql.schema import ForeignKey




@add_schema()
class Usuario(db.Model):

    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    nombres = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(200), nullable=False, unique=True)
    telefono = db.Column(db.String(20), nullable=True)
    pais = db.Column(db.String(200), nullable=True)
    correo = db.Column(db.String(200), nullable=False, unique=True)
    contrasenha = db.Column(db.String(200), nullable=False)
    imagen = db.Column(db.String(200), nullable=True)
    fecha_registro = db.Column(db.DateTime, default=datetime.now())
    fecha_modificacion = db.Column(db.DateTime, default=datetime.now())
    fk_rol = db.Column('fk_rol', db.Integer, db.ForeignKey('roles.id'), nullable=False)
    token = db.Column(MEDIUMTEXT,default="Sin token")
    token_jwt = db.Column(MEDIUMTEXT,default="Sin token")
    activo = db.Column(db.BOOLEAN, default=1)
    logeado = db.Column(db.BOOLEAN, default=0)
    boletin = db.Column(db.BOOLEAN, default=0)
    fk_anfitrion =db.Column(db.Integer,nullable=True)

    def __init__(self, nombres, apellidos, telefono, correo, contrasenha,fk_rol,username,fk_anfitrion,boletin,pais):
        self.nombres = nombres
        self.apellidos = apellidos
        self.telefono = telefono
        self.correo = correo
        self.contrasenha = contrasenha
        self.fk_anfitrion = fk_anfitrion
        self.fk_rol = fk_rol
        self.username = username
        self.boletin = boletin
        self.pais = pais
        # self.imagen = imagen
    def validar_token(token):
        token_jwt = token.split(' ')[1]
        usuario = Usuario.query.filter_by(token_jwt=token_jwt).first()
        return True if usuario else False
@add_schema()
class Rol(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(254), nullable=False)
    activo = db.Column(db.BOOLEAN, default=1)
