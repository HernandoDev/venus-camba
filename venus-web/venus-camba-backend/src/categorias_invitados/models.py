from utilities import database as db, add_schema
from marshmallow_enum import EnumField
import enum
from datetime import datetime
from marshmallow import fields
from sqlalchemy.dialects.mysql import TINYINT



@add_schema()

class CategoriaInvitado(db.Model):

    __tablename__ = 'categoria_invitados'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    color = db.Column(db.String(100), nullable=False)
    fk_evento = db.Column('fk_evento', db.Integer, db.ForeignKey('eventos.id'), nullable=True)

    def __init__(self, nombre, color,fk_evento):
        self.nombre = nombre
        self.color = color
        self.fk_evento = fk_evento

    def __str__(self):
        return self.nombres
