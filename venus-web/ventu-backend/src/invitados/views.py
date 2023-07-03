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
from src.invitados.models import Invitado,ParametosRelacionadorXCategorias
import pytz
invitados = Blueprint('lista_invitados', __name__)

@invitados.route('/listar/<int:id_evento>')
#@token_required
@try_except
def obtener_invitado_x_id(id_evento):
    try:
        invitados = Invitado.query.filter_by(fk_evento=id_evento).all()
        if invitados is not None:
            return jsonify({'data': Invitado.Schema(many=True).dump(invitados), 'success': True, 'message': 'Invitados obtenido'})
        else:
            return jsonify({'data': None, 'success': False, 'message': 'Invitados no encontrado'})
    except Exception as e:
        return jsonify({'data': str(e), 'success': False, 'message': 'Ocurrió un error en el servidor'})

@invitados.route('/listar_relacionador', methods=['POST'])
#@token_required
@try_except
def listar_invitados_relacionador():
    data = request.json
    invitados = Invitado.query.filter_by(fk_usuario=data['id_relacionador']).filter_by(fk_evento=data['id_evento']).all()
    if invitados is not None:
        parametros_relacionador = ParametosRelacionadorXCategorias.query.filter_by(fk_usuario=data['id_relacionador']).filter_by(fk_evento=data['id_evento']).all()
        response={
            'parametros_relacionador':ParametosRelacionadorXCategorias.Schema(many=True).dump(parametros_relacionador),
            'invitados':Invitado.Schema(many=True).dump(invitados)
        }
        return jsonify({'data':response , 'success': True, 'message': 'Invitados obtenido'})
    else:
        return jsonify({'data': None, 'success': False, 'message': 'Invitados no encontrados'})






@invitados.route('/eliminar_asignacion_invitado_relacionador', methods=['POST'])
#@token_required
@try_except
def eliminar_asignacion_invitado_relacionador():
    data = request.json
    invitado = Invitado.query.filter_by(id=data['id']).first()
    invitado.fk_usuario=None
    db.session.merge(invitado)
    db.session.commit()
    return jsonify({'data':'response' , 'success': True, 'message': 'Asignacion eliminada.'})


@invitados.route('/insertar', methods=['POST'])
#@token_required
@try_except
def insertar_invitado():
    data = request.json
    evento = Evento.query.filter_by(id=data['invitado']['fk_evento']).first()
    listaInvitados = Invitado.query.filter_by(fk_evento=data['invitado']['fk_evento']).all()
    contadorInvitados = 0
    for invitado in listaInvitados:
        contadorInvitados += invitado.acompanhantes+1
    contadorInvitados+= data['invitado']['acompanhantes']+1
    if evento.cantidad_invitados < contadorInvitados :
        return respond('Error', False, 'No puede tener más de '+str(evento.cantidad_invitados)+' invitados')
    else:
        auxData  = data['invitado']
        if "observaciones" in auxData:
            invitado = Invitado(data['invitado']['nombres'],data['invitado']['apellidos'],1,data['invitado']['acompanhantes'],data['invitado']['fk_evento'],data['invitado']['observaciones'],'',data['invitado']['telefono'],data['invitado']['fkcategoria'])
        else:
            invitado = Invitado(data['invitado']['nombres'],data['invitado']['apellidos'],1,data['invitado']['acompanhantes'],data['invitado']['fk_evento'],'Sin observaciones','',data['invitado']['telefono'],data['invitado']['fkcategoria'])
        db.session.add(invitado)
        categoria = ''
        if invitado.categoria == 0: 
            categoria ='Estándar'
        elif invitado.categoria == 1: 
            categoria ='VIP'
        elif invitado.categoria == 2: 
            categoria ='Super-VIP'
        if "observaciones" in auxData:
            accion = 'Se ha registrado un nuevo invitado '+data['invitado']["nombres"]+' '+data['invitado']["apellidos"]+' '+data['invitado']["observaciones"]+'  con '+str(data['invitado']['acompanhantes'])+' invitados  por el usuario '+data['correo']
        else:
            accion = 'Se ha registrado un nuevo invitado '+data['invitado']["nombres"]+' '+data['invitado']["apellidos"]+' con '+str(data['invitado']['acompanhantes'])+' invitados  por el usuario '+data['correo']
        now_bolivia = datetime.now(pytz.timezone('America/La_Paz'))
        bitacora = BitacoraEventos(accion,data['invitado']['fk_evento'],1,now_bolivia)
        db.session.add(bitacora)
        db.session.commit()
        return respond(Invitado.Schema().dump(invitado), True, 'Invitado insertado correctamente.')

@invitados.route('/insertarPostman', methods=['POST'])
#@token_required
@try_except
def insertar_invitado_postman():
    data = request.json
    evento = Evento.query.filter_by(id=data['fk_evento']).first()
    listaInvitados = Invitado.query.filter_by(fk_evento=data['fk_evento']).all()
    contadorInvitados = 0
    for invitado in listaInvitados:
        contadorInvitados += invitado.acompanhantes+1
    contadorInvitados+= data['acompanhantes']+1
    if evento.cantidad_invitados < contadorInvitados :
        return respond('Error', False, 'No puede tener más de '+str(evento.cantidad_invitados)+' invitados')
    else:
        if "observaciones" in data:
            invitado = Invitado(data['nombres'],data['apellidos'],1,data['acompanhantes'],data['fk_evento'],data['observaciones'],data['telefono'],data['fkcategoria'])
        else:
            invitado = Invitado(data['nombres'],data['apellidos'],1,data['acompanhantes'],data['fk_evento'],'Sin observaciones',data['telefono'],data['fkcategoria'])
        db.session.add(invitado)
        db.session.commit()
        return respond(Invitado.Schema().dump(invitado), True, 'Invitado insertado correctamente.')


@invitados.route('/editar', methods=['PUT'])
##@token_required
@try_except
def editar_invitado():    
    data = request.json
    invitado = Invitado.query.get(data['id_invitado'])
    nombres_aux = invitado.nombres
    apellidos_aux = invitado.apellidos
    categoria_aux = int(invitado.categoria)
    acompanhantes_aux = invitado.acompanhantes
    if invitado is not None:
        invitado.nombres =data['invitado']['nombres']
        invitado.telefono =data['invitado']['telefono']
        invitado.apellidos = data['invitado']['apellidos']
        invitado.fk_categoria = int(data['invitado']['fkcategoria'])
        invitado.acompanhantes= data['invitado']['acompanhantes']
        invitado.observaciones= data['invitado']['observaciones']
        db.session.merge(invitado)
        accion = 'El invitado '+nombres_aux+' '+apellidos_aux+' con '+str(acompanhantes_aux)+' invitados  ha sido actualizado a '+invitado.nombres+' '+invitado.apellidos+' '+invitado.observaciones+' con '+str(invitado.acompanhantes)+' invitados  por el usuario '+data["correo"]
        now_bolivia = datetime.now(pytz.timezone('America/La_Paz'))
        bitacora = BitacoraEventos(accion,invitado.fk_evento,1,now_bolivia)
        db.session.add(bitacora)
        db.session.commit()
        return respond(Invitado.Schema().dump(invitado), True, 'Invitado editado correctamente')
    else:
        return respond(None, False, 'Invitado no encontrado')

@invitados.route('/insertar_acompanahnte', methods=['POST'])
#@token_required
@try_except
def insertar_acompanahnte():    
    data = request.json
    invitado = Invitado.query.get(data['invitado_id'])
    observaciones_guardia = data['observaciones_guardia']
    if invitado is not None:
        evento = Evento.query.get(invitado.fk_evento)
        #invitado.acompanhantes =invitado.acompanhantes-1
        invitado.ingresos =invitado.ingresos+data['numero_invitados'] 
        invitado.observaciones_guardia = observaciones_guardia
        db.session.merge(invitado)
        categoria = ''
        if invitado.categoria =='0': 
            categoria ='Estándar'
        elif invitado.categoria =='1': 
            categoria ='VIP'
        elif invitado.categoria =='2': 
            categoria ='Super-VIP'
        accion = 'Se ha registrado '+str(data['numero_invitados'])+' ingreso/s para  '+invitado.nombres+' '+invitado.apellidos+' '+invitado.observaciones+' por el usuario '+data["username"]
        now_bolivia = datetime.now(pytz.timezone('America/La_Paz'))
        bitacora = BitacoraEventos(accion,invitado.fk_evento,1,now_bolivia)
        db.session.add(bitacora)
        db.session.commit()
        dictado_invitado =Invitado.Schema().dump(invitado)
        data = {'dictado_invitado':dictado_invitado,'nombreEvento':evento.nombre,'fk_evento':evento.id}
        return respond(data, True, 'Se le ha restado un acompanhante  correctamente')
    else:
        return respond(None, False, 'Invitado no encontrado')        


@invitados.route('/concatenar_qr_evento', methods=['POST'])
#@token_required
@try_except
def concatenar_qr_evento():    
    data = request.json
    #Leemos la imagen del evento
    img_evento = Image.open('.'+data['evento']['imagen'])
    #Descencriptamo la imagen del QR que esta en base64 para luego guardarla como png y leerla con Pillow
    encoded_data = data['QRInvitacion64'].split(',')[1]
    nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    cv2.imwrite('./common/resources/images/eventos/image2.png',img)
    imagen_qr_invitado = Image.open("./common/resources/images/eventos/image2.png")
    #Ajustamos el size del codigo QR con Pillow 
    aux1=data['tamanhoQR']+(data['tamanhoQR']/5)
    aux1 = int(aux1)
    new_image = imagen_qr_invitado.resize((aux1,aux1))
    #Calculamos la posicion en pixeles segun los portentajes de dimensiones recibidos
    positionX=0
    positionY=0
    if data['width']!='' and data['width']!=None:
        # positionX=(data['width']*img_evento.size[0])/100
        positionX=(data['width'])
    if data['height']!='' and data['height']!=None:
        # positionY=(data['height']*img_evento.size[1])/108
        positionY=data['height']
    #Creamos una nueva imagen en blanco con el size de la imagen del evento
    imgen_concatenada = Image.new("RGB", (img_evento.size[0], img_evento.size[1]), "white")
    #Pegamos la imagen del evento en la posicion 0,0
    imgen_concatenada.paste(img_evento, (0, 0))
    #Pegamos la imagen del QR del invitado segun los las posiciones calculadas anteriormente con los  parametros recibidos
    imgen_concatenada.paste(new_image, (int(positionX), int(positionY)))
    #Guardamos la imagen 
    imgen_concatenada.save("./common/resources/images/eventos/invitacionQR.jpeg")
    #Abrimos nuevamente la imagen para agregarle el texto con el nombre del invitado
    imgen_concatenada_open = Image.open("./common/resources/images/eventos/invitacionQR.jpeg")
    draw = ImageDraw.Draw(imgen_concatenada_open)
    #Creamos la fuente del texto a introducir
    font = ImageFont.truetype("arial.ttf", 42)
    #Introducimos el texto
    w,h = font.getsize(data['invitado']['nombres'])
    # draw.text((int(positionX)+40, int(positionY)+210), data['invitado']['nombres'], font=font, stroke_width=1,fill="white")
    draw.text((((img_evento.size[0])-w)/2,img_evento.size[1]-300), data['invitado']['nombres'], font=font, stroke_width=1,fill="white")
    w,h = font.getsize(data['invitado']['apellidos'])
    draw.text((((img_evento.size[0])-w)/2,img_evento.size[1]-260), data['invitado']['apellidos'], font=font, stroke_width=1,fill="white")
    # draw.text((int(positionX)+40, int(positionY)+240), data['invitado']['apellidos'], font=font, stroke_width=1,fill="white")
    imgen_concatenada_open.save("./common/resources/images/eventos/invitacionQRFinal.jpg")
    mensaje = {"message":  data['mensaje'], "phone": data['invitado']['telefono'],"url_imagen":'/common/resources/images/eventos/invitacionQRFinal.jpg'}
    return jsonify({'data': mensaje, 'success': True, 'message': 'Imagenes generadas correctamente.'})

@invitados.route('/concatenar_qr_evento_todos', methods=['POST'])
#@token_required
@try_except
def concatenar_qr_evento_todos():    
    data = request.json
    for invitado in data['invitados']:
    #Leemos la imagen del evento
        encoded_data = invitado['base64QR'].split(',')[1]
        img_evento = Image.open('.'+data['evento']['imagen'])
        nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        cv2.imwrite('./common/resources/images/eventos/image2.png',img)
        imagen_qr_invitado = Image.open("./common/resources/images/eventos/image2.png")
        #Ajustamos el size del codigo QR con Pillow 
        aux1=data['tamanhoQR']+(data['tamanhoQR']/5)
        aux1 = int(aux1)
        new_image = imagen_qr_invitado.resize((aux1,aux1))        #Calculamos la posicion en pixeles segun los portentajes de dimensiones recibidos
        positionX=0
        positionY=0
        if data['width']!='' and data['width']!=None:
            # positionX=(data['width']*img_evento.size[0])/100
            positionX=(data['width'])

        if data['height']!='' and data['height']!=None:
            # positionY=(data['height']*img_evento.size[1])/100 
            positionY=data['height']
        #Creamos una nueva imagen en blanco con el size de la imagen del evento
        imgen_concatenada = Image.new("RGB", (img_evento.size[0], img_evento.size[1]), "white")
        #Pegamos la imagen del evento en la posicion 0,0
        imgen_concatenada.paste(img_evento, (0, 0))
        #Pegamos la imagen del QR del invitado segun los las posiciones calculadas anteriormente con los  parametros recibidos
        imgen_concatenada.paste(new_image, (int(positionX), int(positionY)))
        #Guardamos la imagen 
        imgen_concatenada.save("./common/resources/images/eventos/invitacionQR.jpeg")
        #Abrimos nuevamente la imagen para agregarle el texto con el nombre del invitado
        imgen_concatenada_open = Image.open("./common/resources/images/eventos/invitacionQR.jpeg")
        draw = ImageDraw.Draw(imgen_concatenada_open)
        #Creamos la fuente del texto a introducir
        random_name=get_random_string(12)

        font = ImageFont.truetype("arial.ttf", 42)
        #Introducimos el texto
        w,h = font.getsize(invitado['nombres'])
        # draw.text((int(positionX)+40, int(positionY)+210), data['invitado']['nombres'], font=font, stroke_width=1,fill="white")
        draw.text((((img_evento.size[0])-w)/2,img_evento.size[1]-300), invitado['nombres'], font=font, stroke_width=1,fill="white")
        w,h = font.getsize(invitado['apellidos'])
        draw.text((((img_evento.size[0])-w)/2,img_evento.size[1]-260), invitado['apellidos'], font=font, stroke_width=1,fill="white")
        imgen_concatenada_open.save("./common/resources/images/eventos/"+random_name+".jpg")
        mensaje = {"message":  data['mensaje'], "phone": invitado['telefono'],"url_imagen":'/common/resources/images/eventos/'+random_name+'.jpg'}
        invitado['mensaje_datos']=mensaje
    return jsonify({'data': data['invitados'], 'success': True, 'message': 'Imagenes generadas correctamente.'})                      

def get_random_string(length):
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

@invitados.route('/eliminar', methods=['POST'])
@try_except
#@token_required
def eliminar_invitado():
        data = request.json
        invitado = Invitado.query.get(data['id'])
        categoria = ''
        if invitado is not None:
            if int(invitado.categoria) ==0: 
                categoria ='Estándar'
            elif int(invitado.categoria) ==1: 
                categoria ='VIP'
            elif int(invitado.categoria) ==2: 
                categoria ='Super-VIP'
            db.session.delete(invitado)
            accion = 'El invitado '+invitado.nombres+' '+invitado.apellidos+' con '+str(invitado.acompanhantes)+' invitados  ha sido eliminado por '+data['correo']
            now_bolivia = datetime.now(pytz.timezone('America/La_Paz'))
            bitacora = BitacoraEventos(accion,invitado.fk_evento,1,now_bolivia)
            db.session.add(bitacora)
            db.session.commit()
            return jsonify({'data':'', 'success': True, 'message': 'Invitado eliminado'})
        else : 
            return jsonify({'data': None, 'success': False, 'message': 'Invitado no encontrada'})

@invitados.route('/insertar_excel', methods=['POST'])
@try_except
#@token_required
def insertar_excel():
    data =json.loads(request.form['body'])
    if 'excel' in request.files and request.files['excel'].filename != '':
        fileinfo =request.files["excel"]
        extension = os.path.splitext(fileinfo.filename)[1]
        fname = fileinfo.filename
        extn = os.path.splitext(fname)[1]
        cname = str(uuid.uuid4()) + extn
        arrayErrores=[]
        arrayInvitados = []
        ruta = guardar_archivo('plantillas_excel', fileinfo)
        id_evento =data['id_evento']
        evento = Evento.query.get(id_evento)
        estado ={"estado":0} 
        ruta='.'+ruta
        totalIngresos =0
        columns = ['Nombre', 'Apellidos', 'Whatsapp', 'Acompañantes', 'Categoría', 'Observaciones']
        df = pd.read_excel(ruta, skiprows=4)
        # remove(ruta)
        if list(df.columns) != columns:
            estado ={"estado":4}  #plantilla invalida
            arrayErrores.append('La plantilla insertada fue alterada. Por favor, evite editar las columnas.')
            return respond(arrayErrores, False, 'Error al insertar invitados mediante excel.')
        else: 
            new_invitado = df[{'Nombre', 'Apellidos', 'Whatsapp', 'Acompañantes', 'Categoría', 'Observaciones'}]
            for index in new_invitado.index:
                nombre = str(new_invitado['Nombre'][index])
                # if nombre =='nan':
                #     nombre = ''
                apellidos = str(new_invitado['Apellidos'][index])
                # if apellidos =='nan':
                #     apellidos = ''
                telefono = str(new_invitado['Whatsapp'][index])
                acompanhantes = str(new_invitado['Acompañantes'][index])
                categoria = str(new_invitado['Categoría'][index])
                # if categoria =='nan':
                #     categoria = ''
                observaciones = str(new_invitado['Observaciones'][index])
                if observaciones == '' or observaciones==None or observaciones=='nan':
                    observaciones='Sin observaciones'
                if acompanhantes=='nan':
                    acompanhantes=0
                if acompanhantes.isdigit():
                    acompanhantes = int(acompanhantes)
                    totalIngresos+=acompanhantes+1
                    if acompanhantes>=10:
                        estado ={"estado":2}  #acompanhantes excede el limite de 9 
                        arrayErrores.append('El invitado '+nombre+' '+apellidos+' no puede tener mas de 9 acompañantes.')
                    else:
                        if telefono =='nan':
                            telefono=''
                        if telefono.isdigit() or telefono=='':
                            if nombre == '' or nombre==None or nombre == 'nan' :
                                estado ={"estado":6}  #nombre vacio 
                                arrayErrores.append('No pueden haber nombres vacíos.')
                                nombre=''
                            else:
                                if apellidos == '' or apellidos==None or apellidos == 'nan' :
                                    estado ={"estado":6}  #apellidos vacio 
                                    apellidos=''
                                    arrayErrores.append('No pueden haber apellidos vacíos.')
                                else:
                                    if categoria=='nan':
                                        categoria=''
                                    categoria_aux = CategoriaInvitado.query.filter_by(fk_evento=id_evento).filter_by(nombre=categoria).first()
                                    if categoria_aux ==None:
                                        estado ={"estado":1}  #categoria no encontrada en el evento
                                        if categoria =='':
                                            arrayErrores.append('La Categoría esta vacía asignado al  invitado '+nombre+' '+apellidos+'.')
                                        else : 
                                            arrayErrores.append('La Categoría '+categoria+' asignada al  invitado '+nombre+' '+apellidos+' no existe para este evento.')
                                    else:
                                        invitado = Invitado(nombre,apellidos,1,acompanhantes,id_evento,observaciones,'',telefono,categoria_aux.id)
                                        arrayInvitados.append(invitado)
                        else:
                            estado ={"estado":5}  #telefono formato incorrecto,no es un numero
                            arrayErrores.append('El Whatsapp asignado al  invitado '+nombre+' '+apellidos+' no tiene un formato válido.')
                else:
                    estado ={"estado":3}  #acompanhantes formato incorrecto,no es un numero
                    arrayErrores.append('Los acompañantes asignados al  invitado '+nombre+' '+apellidos+' no tiene un formato válido.')
            if estado['estado'] ==0:
                if data['acompanhantesRestantes']-totalIngresos<0:
                    arrayErrores.append('Límite de invitados superado.')
                    return respond(arrayErrores, False, 'Error al insertar invitados mediante excel.')
                else : 

                    db.session.bulk_save_objects(arrayInvitados)
                    db.session.commit()
                    dictado_invitado =Invitado.Schema(many=True).dump(arrayInvitados)
                    return respond(dictado_invitado, True, 'Se han insertado correctamente los invitados al evento.')
            else:
                return respond(arrayErrores, False, 'Error al insertar invitados mediante excel.')
    else:
        return respond(None, False, 'Falta seleccionar el excel') 
   