from flask import Blueprint, jsonify, request

from utilities import database as db
from src.eventos.models import BitacoraEventos, Evento
from common.utils import guardar_imagen, respond, token_required, try_except,guardar_archivo
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import pandas as pd
import matplotlib.pyplot as plt
import requests
import uuid
import random
from src.categorias_invitados.models import CategoriaInvitado
import string
from os import *
import os
import cv2 
import base64

import json
from datetime import datetime
from datetime import timedelta
from src.planes.models import Planes,AsignacionParametrosPlanes,ParametrosPlanes
import pytz
planes = Blueprint('planes', __name__)

@planes.route('/listar')
#@token_required
@try_except
def obtener_planes():
    try:
        planes = Planes.query.filter_by(activado_soft_delete=0).join(AsignacionParametrosPlanes).all()
        parametros_planes = ParametrosPlanes.query.filter_by(activado_soft_delete=0).all()
        resultado_planes =[]
        array_aux_asiganciones = []
        for plan in planes :
            array_aux_asiganciones = []
            for asignacion in plan.AsignacionParametrosPlanes:
                aux_asignacion ={
                    'id':asignacion.id,
                    'fk_plan':asignacion.fk_plan,
                    'fk_parametro':asignacion.fk_parametro,
                    'valor_parametro':asignacion.valor_parametro,
                    'habilitada':asignacion.habilitada,
                    'parametro_plan':{
                        'id':asignacion.ParametrosPlanes.id,
                        'descripcion':asignacion.ParametrosPlanes.descripcion,
                        }
                }
                array_aux_asiganciones.append(aux_asignacion)
            aux_plan ={
                'id':plan.id,
                'nombre':plan.nombre,
                'precio':plan.precio,
                'asignacion_plan':array_aux_asiganciones,
            }
            resultado_planes.append(aux_plan)
        # resultado_planes =  Planes.Schema(many=True).dump(planes)
        parametros_resultado_planes =  ParametrosPlanes.Schema(many=True).dump(parametros_planes)
        respuesta ={}
        respuesta['parametros']=parametros_resultado_planes
        respuesta['planes']=resultado_planes

        return jsonify({'data':respuesta, 'success': True, 'message': 'Invitados obtenido'})
    except Exception as e:
        return jsonify({'data': str(e), 'success': False, 'message': 'Ocurrió un error en el servidor'})

