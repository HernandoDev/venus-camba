"""Agregada tabla bitacora_evento

Revision ID: cd7cd8a404bb
Revises: de14b8c9269b
Create Date: 2022-09-15 12:13:19.398520

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cd7cd8a404bb'
down_revision = 'de14b8c9269b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('bitacora_evento', sa.Column('fecha_creacion', sa.DateTime(timezone=True), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('bitacora_evento', 'fecha_creacion')
    # ### end Alembic commands ###
