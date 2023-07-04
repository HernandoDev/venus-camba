"""Nuevos atributos para el  anfitrion y evento para la landing page

Revision ID: f6b723c4b77f
Revises: f2a95e20ba5a
Create Date: 2022-10-15 06:53:19.291009

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'f6b723c4b77f'
down_revision = 'f2a95e20ba5a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('usuarios', 'pais',
               existing_type=mysql.VARCHAR(length=200),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('usuarios', 'pais',
               existing_type=mysql.VARCHAR(length=200),
               nullable=False)
    # ### end Alembic commands ###