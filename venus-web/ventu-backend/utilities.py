from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

database = SQLAlchemy()
schemas = Marshmallow()
jwt = JWTManager()
migrations = Migrate()


# Serializador de modelos SQLAlchemy
def add_schema(**kwgs):
    def decorator(cls):
        class Meta:
            model = cls
        schema = type("Schema", (schemas.SQLAlchemyAutoSchema,), {"Meta": Meta, **kwgs})
        cls.Schema = schema
        return cls
    return decorator
