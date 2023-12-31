"""crear-tablas

Revision ID: 69d7b6a3fe17
Revises: 
Create Date: 2022-09-12 21:04:38.446237

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '69d7b6a3fe17'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('productos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=100), nullable=False),
    sa.Column('descripcion', sa.Text(), nullable=True),
    sa.Column('categoria', sa.Enum('MODA', 'DEPORTE', 'SALUD', 'BELLEZA', 'HERRAMIENTAS', 'TECNOLOGIA', name='productocategorias'), nullable=True),
    sa.Column('precio', sa.Integer(), nullable=False),
    sa.Column('cantidad', sa.Integer(), nullable=False),
    sa.Column('disponible', sa.BOOLEAN(), nullable=True),
    sa.Column('fecha_creacion', sa.DateTime(), nullable=True),
    sa.Column('imagen', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('nombre')
    )
    op.create_table('roles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=100), nullable=False),
    sa.Column('descripcion', sa.String(length=254), nullable=False),
    sa.Column('activo', sa.BOOLEAN(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('usuarios',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombres', sa.String(length=100), nullable=False),
    sa.Column('apellidos', sa.String(length=100), nullable=False),
    sa.Column('username', sa.String(length=200), nullable=False),
    sa.Column('telefono', sa.String(length=20), nullable=True),
    sa.Column('correo', sa.String(length=200), nullable=False),
    sa.Column('contrasenha', sa.String(length=200), nullable=False),
    sa.Column('imagen', sa.String(length=200), nullable=True),
    sa.Column('fecha_registro', sa.DateTime(), nullable=True),
    sa.Column('fecha_modificacion', sa.DateTime(), nullable=True),
    sa.Column('fk_rol', sa.Integer(), nullable=False),
    sa.Column('token', mysql.MEDIUMTEXT(), nullable=True),
    sa.Column('token_jwt', mysql.MEDIUMTEXT(), nullable=True),
    sa.Column('activo', sa.BOOLEAN(), nullable=True),
    sa.Column('logeado', sa.BOOLEAN(), nullable=True),
    sa.Column('fk_anfitrion', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['fk_rol'], ['roles.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('correo'),
    sa.UniqueConstraint('username')
    )
    op.create_table('eventos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=100), nullable=False),
    sa.Column('descripcion', sa.String(length=500), nullable=False),
    sa.Column('fecha_inicio', sa.DateTime(), nullable=True),
    sa.Column('hora_inicio', sa.String(length=100), nullable=False),
    sa.Column('fecha_fin', sa.DateTime(), nullable=True),
    sa.Column('hora_fin', sa.String(length=100), nullable=False),
    sa.Column('categoria', sa.String(length=100), nullable=False),
    sa.Column('tipo', mysql.TINYINT(), nullable=True),
    sa.Column('cantidad_invitados', sa.Integer(), nullable=False),
    sa.Column('imagen', sa.String(length=100), nullable=False),
    sa.Column('fk_usuario', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['fk_usuario'], ['usuarios.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('invitados',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombres', sa.String(length=100), nullable=False),
    sa.Column('apellidos', sa.String(length=100), nullable=False),
    sa.Column('acompanhantes', sa.Integer(), nullable=False),
    sa.Column('observaciones', sa.String(length=200), nullable=True),
    sa.Column('categoria', sa.String(length=100), nullable=False),
    sa.Column('ingresos', sa.Integer(), nullable=True),
    sa.Column('fk_evento', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['fk_evento'], ['eventos.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('invitados')
    op.drop_table('eventos')
    op.drop_table('usuarios')
    op.drop_table('roles')
    op.drop_table('productos')
    # ### end Alembic commands ###
