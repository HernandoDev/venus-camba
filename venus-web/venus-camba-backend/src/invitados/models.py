from utilities import database as db, add_schema
from marshmallow_enum import EnumField
import enum
from datetime import datetime
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import relationship
from marshmallow import fields

from src.categorias_invitados.models import CategoriaInvitado


@add_schema(CategoriaInvitado=fields.Nested(CategoriaInvitado.Schema))
class Invitado(db.Model):

    __tablename__ = 'invitados'

    id = db.Column(db.Integer, primary_key=True)
    nombres = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    acompanhantes = db.Column(db.Integer, nullable=False)
    observaciones = db.Column(db.String(200), nullable=True)
    observaciones_guardia = db.Column(db.String(250), nullable=True)
    fk_usuario = db.Column(db.Integer, nullable=True)
    categoria = db.Column(db.String(100), nullable=False)
    ingresos = db.Column(db.Integer, nullable=True,default=0)
    fk_evento = db.Column('fk_evento', db.Integer, db.ForeignKey('eventos.id'), nullable=True)
    fk_categoria = db.Column('fk_categoria', db.Integer, db.ForeignKey('categoria_invitados.id'), nullable=True)
    
    CategoriaInvitado = relationship('CategoriaInvitado')


    def __init__(self, nombres, apellidos,categoria,acompanhantes, fk_evento,observaciones,observaciones_guardia,telefono,fk_categoria):
        self.nombres = nombres
        self.apellidos = apellidos
        self.acompanhantes = acompanhantes
        self.categoria = categoria
        self.fk_evento = fk_evento
        self.observaciones = observaciones,
        self.observaciones_guardia = observaciones_guardia
        self.telefono = telefono
        self.fk_categoria = fk_categoria


    def __str__(self):
        return self.nombres


@add_schema(CategoriaInvitado=fields.Nested(CategoriaInvitado.Schema))
class ParametosRelacionadorXCategorias(db.Model):

    __tablename__ = 'parametros_relacionador_x_categoria_invitados'

    id = db.Column(db.Integer, primary_key=True)
    fk_usuario = db.Column(db.Integer, nullable=True)
    fk_evento = db.Column(db.Integer, nullable=True)
    fk_categoria = db.Column('fk_categoria', db.Integer, db.ForeignKey('categoria_invitados.id'), nullable=True)
    comision = db.Column(db.String(200), nullable=True)
    limite_invitados = db.Column(db.Integer, nullable=True)
    CategoriaInvitado = relationship('CategoriaInvitado')

    def __init__(self, fk_usuario, fk_evento,fk_categoria,comision, limite_invitados):
        self.fk_usuario = fk_usuario
        self.fk_evento = fk_evento
        self.fk_categoria = fk_categoria
        self.comision = comision
        self.limite_invitados = limite_invitados

    def __str__(self):
        return self.nombres