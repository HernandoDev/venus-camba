"""Agregada tabla bitacora_evento

Revision ID: 8e6c9829c8fa
Revises: cd7cd8a404bb
Create Date: 2022-09-15 12:29:53.102940

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8e6c9829c8fa'
down_revision = 'cd7cd8a404bb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('bitacora_evento', 'fecha')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('bitacora_evento', sa.Column('fecha', sa.DATE(), nullable=False))
    # ### end Alembic commands ###
