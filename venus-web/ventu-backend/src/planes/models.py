from utilities import database as db, add_schema
from marshmallow_enum import EnumField
import enum
from datetime import datetime
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import relationship
from marshmallow import fields




@add_schema()
class ParametrosPlanes(db.Model):

    __tablename__ = 'parametros_planes'

    id = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String(100), nullable=False)
    activado_soft_delete = db.Column(db.Integer, nullable=True,default =0)
    def __init__(self, descripcion):
        self.descripcion = descripcion

    def __str__(self):
        return self.descripcion


@add_schema(ParametrosPlanes=fields.Nested(ParametrosPlanes.Schema))
class AsignacionParametrosPlanes(db.Model):

    __tablename__ = 'asignacion_parametros_planes'

    id = db.Column(db.Integer, primary_key=True)
    fk_parametro = db.Column('fk_parametro', db.Integer, db.ForeignKey('parametros_planes.id'), nullable=True)
    fk_plan = db.Column('fk_plan', db.Integer, db.ForeignKey('planes.id'), nullable=True)
    habilitada = db.Column(db.Integer, nullable=True,default =1)
    valor_parametro = db.Column(db.Integer, nullable=True,default =0)
    ParametrosPlanes = relationship('ParametrosPlanes')

    
    def __init__(self, descripcion):
        self.descripcion = descripcion

    def __str__(self):
        return self.descripcion

@add_schema(AsignacionParametrosPlanes=fields.Nested(AsignacionParametrosPlanes.Schema))
class Planes(db.Model):

    __tablename__ = 'planes'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.Integer, nullable=True)
    activado_soft_delete = db.Column(db.Integer, nullable=True,default =0)
    AsignacionParametrosPlanes = relationship('AsignacionParametrosPlanes')


    def __init__(self, nombres, precio):
        self.nombres = nombres
        self.precio = precio


    def __str__(self):
        return self.nombres

