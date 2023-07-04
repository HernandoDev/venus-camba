from flask import Blueprint, jsonify, request

from utilities import database as db
from src.eventos.models import BitacoraEventos, Evento

from common.utils import guardar_imagen, respond, token_required, try_except
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import matplotlib.pyplot as plt
import requests

from src.categorias_invitados.models import CategoriaInvitado

import cv2 
import base64

import json
from datetime import datetime
from datetime import timedelta
from src.invitados.models import Invitado,ParametosRelacionadorXCategorias
from src.usuarios.models import Usuario
from src.eventos.models import AsignacionEvento, Evento,BitacoraEventos
import pytz
categorias_invitados = Blueprint('categorias_invitados', __name__)

@categorias_invitados.route('/listar/<int:id_evento>')
#@token_required
@try_except
def obtener_categorias_x_id(id_evento):
    try:
        categorias = CategoriaInvitado.query.filter_by(fk_evento=id_evento).all()
        if categorias is not None:
            dict_categorias=[]
            for categoria in categorias:
                aux={
                    "id":categoria.id,
                    "nombre":categoria.nombre,
                    "color":categoria.color,
                    "codigo":categoria.id,
                    "fkevento":categoria.fk_evento,
                }
                dict_categorias.append(aux)
            # return jsonify({'data': CategoriaInvitado.Schema(many=True).dump(categorias), 'success': True, 'message': 'Categorias obtenidas'})
            return jsonify({'data': dict_categorias, 'success': True, 'message': 'Categorias obtenidas'})

        else:
            return jsonify({'data': None, 'success': False, 'message': 'Categorias  no encontradas'})
    except Exception as e:
        print(e)
        return jsonify({'data': str(e), 'success': False, 'message': 'Ocurrió un error en el servidor'})


@categorias_invitados.route('/insertar', methods=['POST'])
#@token_required
@try_except
def insertar_categoria_invitado():
    data = request.json
    categoria = CategoriaInvitado(data['nombre'],data['valColor'],data['fkevento'])
    relacionadores_asignados = Usuario.query.filter_by(fk_rol=3).join(AsignacionEvento).filter_by(fk_eventos=data['fkevento']).all()
    db.session.add(categoria)
    db.session.commit()
    aux_categoria = CategoriaInvitado.Schema().dump(categoria)
    comision =20
    limite_invitados =10
    for relacionador in relacionadores_asignados:
        parametro = ParametosRelacionadorXCategorias( relacionador.id, data['fkevento'],aux_categoria['id'],comision, limite_invitados)
        db.session.add(parametro)
    db.session.commit()
    return respond(CategoriaInvitado.Schema().dump(categoria), True, 'Categoria insertada correctamente.')


@categorias_invitados.route('/eliminar', methods=['POST'])
@try_except
#@token_required
def eliminar_categoria():
        data = request.json
        categoria = CategoriaInvitado.query.get(str(data['id_categoria']))
        invitados = Invitado.query.filter_by(fk_categoria=categoria.id).all()
        if categoria is not None:
            if len(invitados)<=0:
                parametros_relacionador = ParametosRelacionadorXCategorias.query.filter_by(fk_categoria=categoria.id).all()
                for parametro in parametros_relacionador:
                    db.session.delete(parametro)
                db.session.delete(categoria)
                db.session.commit()
                return jsonify({'data': CategoriaInvitado.Schema().dump(categoria), 'success': True, 'message': 'Categoria eliminada'})
            else:
                return jsonify({'data': None, 'success': False, 'message': 'La categoría no se puede eliminar ya que aun tiene invitados asociados a esta.'})
        else : 
            return jsonify({'data': None, 'success': False, 'message': 'Categoria no encontrada'})


@categorias_invitados.route('/editar', methods=['PUT'])
##@token_required
@try_except
def editar_invitado():    
    data = request.json
    categoria = CategoriaInvitado.query.get(data['categoria']['id'])
    if categoria is not None:
        categoria.nombre =data['categoria']['nombre']
        categoria.color =data['categoria']['color']
        db.session.merge(categoria)
        # accion = 'El invitado('+nombres_aux+' '+apellidos_aux+' con '+str(acompanhantes_aux)+' invitados con categoria '+categoria+') ha sido actualizado a '+invitado.nombres+' '+invitado.apellidos+' '+invitado.observaciones+' con '+str(invitado.acompanhantes)+' invitados con categoria '+categoria_nueva+' por el usuario '+data["correo"]
        # now_bolivia = datetime.now(pytz.timezone('America/La_Paz'))
        # bitacora = BitacoraEventos(accion,invitado.fk_evento,1,now_bolivia)
        # db.session.add(bitacora)
        db.session.commit()
        return respond(CategoriaInvitado.Schema().dump(categoria), True, 'Categoria editada correctamente')
    else:
        return respond(None, False, 'Invitado no encontrado')