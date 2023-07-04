from utilities import database as db, add_schema
from marshmallow_enum import EnumField
import enum
from sqlalchemy.sql import func

from datetime import datetime
from sqlalchemy.dialects.mysql import TINYINT
from src.planes.models import Planes,AsignacionParametrosPlanes,ParametrosPlanes


from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.orm import relationship
from marshmallow import fields
import pytz
from src.planes.models import Planes,AsignacionParametrosPlanes,ParametrosPlanes



@add_schema(Planes=fields.Nested(Planes.Schema))
class Evento(db.Model):

    __tablename__ = 'eventos'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(500), nullable=False)
    fecha_inicio = db.Column(db.DateTime, default=datetime.now())
    hora_inicio = db.Column(db.String(100), nullable=False)
    fecha_fin = db.Column(db.DateTime, default=datetime.now())
    hora_fin = db.Column(db.String(100), nullable=False)
    categoria = db.Column(db.String(100), nullable=False)
    tipo_evento = db.Column(db.String(200), nullable=False)
    soft_delete_activado = db.Column(db.Integer,default=0, nullable=False)
    pais = db.Column(db.String(100), nullable=False)
    habilitado = db.Column(TINYINT, default=1)
    nombre_lugar = db.Column(db.String(200), nullable=False)
    direccion = db.Column(db.String(200), nullable=False)
    link_google = db.Column(db.String(200), nullable=False)
    tipo = db.Column(TINYINT, default=1)
    cantidad_invitados = db.Column(db.Integer, nullable=False)
    imagen = db.Column(db.String(100), nullable=False, )
    #fk_usuario = db.Column(db.Integer, nullable=False)
    fk_plan = db.Column('fk_plan', db.Integer, db.ForeignKey('planes.id'), nullable=True)
    fk_usuario = db.Column('fk_usuario', db.Integer, db.ForeignKey('usuarios.id'), nullable=True)
    Planes = relationship('Planes')

    def __init__(self, nombre, descripcion, fecha_inicio,hora_inicio,fecha_fin,hora_fin,categoria,tipo, cantidad_invitados, fk_usuario,tipo_evento,pais,nombre_lugar,direccion,link_google,habilitado,fk_plan):
        self.nombre = nombre
        self.descripcion = descripcion
        self.fecha_inicio = fecha_inicio
        self.hora_inicio = hora_inicio
        self.fecha_fin = fecha_fin
        self.hora_fin = hora_fin
        self.categoria = categoria
        self.tipo = tipo
        self.cantidad_invitados = cantidad_invitados
        self.fk_usuario = fk_usuario
        self.tipo_evento = tipo_evento
        self.pais = pais
        self.nombre_lugar = nombre_lugar
        self.direccion = direccion
        self.link_google = link_google
        self.habilitado = habilitado
        self.fk_plan = fk_plan

    def __str__(self):
        return self.nombre

        
@add_schema()
class AsignacionEvento(db.Model):
    __tablename__ = 'eventos_x_usuarios'

    id = db.Column(db.Integer, primary_key=True)
    fk_usuario = db.Column('fk_usuario', db.Integer, db.ForeignKey('usuarios.id'), nullable=True)
    fk_eventos = db.Column('fk_eventos', db.Integer, db.ForeignKey('eventos.id'), nullable=True)

    def __init__(self, usuario, evento):
        self.fk_usuario = usuario
        self.fk_eventos = evento


    def __str__(self):
        return self.id



@add_schema()
class BitacoraEventos(db.Model):
    __tablename__ = 'bitacora_evento'

    id = db.Column(db.Integer, primary_key=True)
    accion = db.Column(db.String(255), nullable=False)
    fk_evento = db.Column('fk_evento', db.Integer, db.ForeignKey('eventos.id'), nullable=True)
    fk_usuario = db.Column('fk_usuario', db.Integer, db.ForeignKey('usuarios.id'), nullable=True)
    fecha_creacion = db.Column(db.DateTime(timezone=True), default=datetime.now(pytz.timezone('America/La_Paz')))


    def __init__(self, accion, fk_evento,fk_usuario,fecha_creacion):
        self.accion = accion
        self.fk_evento = fk_evento
        self.fk_usuario = fk_usuario
        self.fecha_creacion = fecha_creacion


    def __str__(self):
        return self.id        