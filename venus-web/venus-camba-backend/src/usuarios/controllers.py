import hashlib
import json
from random import randint
from src.eventos.models import AsignacionEvento, Evento
from datetime import date
import datetime
from flask import Blueprint, request,jsonify
import uuid
from flask_jwt_extended import create_access_token
from utilities import database as db
from src.usuarios.models import *
from common.utils import enviar_email_registro_web, try_except, respond,token_required,guardar_imagen,get_random_string
from src.usuarios.models import *
from PIL import Image
from io import BytesIO
import re, time, base64
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formataddr
from email.mime.base import MIMEBase
from src.invitados.models import ParametosRelacionadorXCategorias
from src.planes.models import Planes,AsignacionParametrosPlanes,ParametrosPlanes

from src.categorias_invitados.models import CategoriaInvitado

usuarios = Blueprint('usuario', __name__)


@usuarios.route('/api/usuario/login', methods=['POST'])
@try_except
def login():
    correo = request.json['correo']
    contrasenha = request.json['contrasenha']
    portero = False
    usuario = Usuario.query.filter_by(correo=correo).first()
    if usuario == None :
        usuario = Usuario.query.filter_by(username=correo).first()
        portero = True
    contrasenha = hashlib.sha512(contrasenha.encode()).hexdigest()
    if usuario is not None :
            if usuario.fk_rol ==2 :
                portero = True
            if contrasenha ==  usuario.contrasenha:
                if usuario.logeado == False :
                    if portero == True : 
                        if usuario.fk_rol == 2 :
                            token = create_access_token(identity={'id': usuario.id, 'correo': usuario.correo})
                            usuario.token_jwt = token
                            usuario.logeado = True
                            usuario_anfitrion_padre = Usuario.query.filter_by(id=usuario.fk_anfitrion).first()
                            usuario.imagen =usuario_anfitrion_padre.imagen 
                            db.session.commit()
                            usuario_enviar =  Usuario.Schema().dump(usuario)
                            usuario_enviar['fk_rol'] =usuario.fk_rol
                            return respond({'usuario':usuario_enviar}, True, 'Login exitoso')
                        else : 
                            return respond('', False, 'El usuario no existe.')
                    else:
                        if usuario.fk_rol == 1 :
                            token = create_access_token(identity={'id': usuario.id, 'correo': usuario.correo})
                            usuario.token_jwt = token
                            usuario.logeado = True
                            if usuario.fk_anfitrion!= None:
                                usuario_anfitrion_padre = Usuario.query.filter_by(id=usuario.fk_anfitrion).first()
                                usuario.imagen =usuario_anfitrion_padre.imagen 
                            db.session.commit()
                            usuario_enviar =  Usuario.Schema().dump(usuario)
                            usuario_enviar['fk_rol'] =usuario.fk_rol
                            return respond({'usuario':usuario_enviar}, True, 'Login exitoso')
                        else :
                            return respond('', False, 'El usuario no existe.')
                else:
                    return respond(None, False, 'Usted ya inicio sesión en otro dispositivo, cierre su previa sesión para poder ingresar.')
            else:
                return respond(None, False, 'El correo y/o contraseña son incorrectos')
    else:
        return respond('', False, 'El correo y/o contraseña son incorrectos')



@usuarios.route('/api/usuario/login_web', methods=['POST'])
@try_except
def login_web():
    correo = request.json['correo']
    contrasenha = request.json['contrasenha']
    usuario = Usuario.query.filter_by(correo=correo).first()
    contrasenha = hashlib.sha512(contrasenha.encode()).hexdigest()
    if usuario is not None :
            if contrasenha ==  usuario.contrasenha:
                # if usuario.logeado == False :
                    if usuario.fk_rol == 1 :
                        token = create_access_token(identity={'id': usuario.id, 'correo': usuario.correo})
                        usuario.token_jwt = token
                        if usuario.fk_anfitrion!= None:
                            usuario_anfitrion_padre = Usuario.query.filter_by(id=usuario.fk_anfitrion).first()
                            usuario.imagen =usuario_anfitrion_padre.imagen 
                        # usuario.logeado = True
                        db.session.commit()
                        usuario_enviar =  Usuario.Schema().dump(usuario)
                        usuario_enviar['fk_rol'] =usuario.fk_rol
                        return respond({'usuario':usuario_enviar}, True, 'Login exitoso')
                    else :
                        return respond('', False, 'El usuario no existe.')
                # else:
                    # return respond(None, False, 'Usted ya inicio sesión en otro dispositivo, cierre su previa sesión para poder ingresar.')
            else:
                return respond(None, False, 'El correo y/o contraseña son incorrectos')
    else:
        return respond('', False, 'El correo y/o contraseña son incorrectos')



@usuarios.route('/api/usuario/logout', methods=['POST'])
@try_except
#@token_required
def logout():
    id_usuario = request.json['usuario_id']
    usuario = Usuario.query.filter_by(id=id_usuario).first()
    if usuario is not None :
        usuario.logeado = False
        db.session.commit()
        # usuario_enviar =  Usuario.Schema().dump(usuario)
        return respond({'mensaje':{}}, True, 'Logout exitoso')
    else:
        return respond('', False, 'Usuario no encontrado')

@usuarios.route('/api/usuario/registrar', methods=['POST'])
@try_except
def registrar_usuario_movil():
    data =json.loads(request.form['body'])
    pass_aux =  hashlib.sha512(data['contrasenha'].encode()).hexdigest()
    if data['fk_rol'] ==2:
        #USUARIO PORTERO
        usuarios = Usuario(data['nombres'], data['apellidos'], data['telefono'], data['correo'],pass_aux,data['fk_rol'],data['username'],data['fk_anfitrion'],data['boletin'],data['pais'])
    elif data['fk_rol'] == 1 : 
        #USUARIO ANFITRION
        if 'fk_anfitrion' in data: #ANFITRION HIJO
            usuarios = Usuario(data['nombres'], data['apellidos'], data['telefono'], data['correo'],pass_aux,data['fk_rol'],data['username'],data['fk_anfitrion'] ,data['boletin'],data['pais'])
        else: #ANFITRION PADE
            if 'imagen' in request.files and request.files['imagen'].filename != '':
                ruta_imagen = guardar_imagen('usuarios', request.files['imagen'])
            else:
                return respond(None, False, 'Falta seleccionar una imagen')            
            usuarios = Usuario(data['nombres'], data['apellidos'], data['telefono'], data['correo'],pass_aux,data['fk_rol'],data['username'],None ,data['boletin'],data['pais'])
    else :
            usuarios = Usuario(data['nombres'], data['apellidos'], data['telefono'], data['correo'],pass_aux,data['fk_rol'],data['username'],data['fk_anfitrion'] ,data['boletin'],data['pais'])
    email = Usuario.query.filter_by(correo=usuarios.correo).first()
    username = Usuario.query.filter_by(username=usuarios.username).first()
    if email == None and username ==None:
        db.session.add(usuarios)
        user_aux = Usuario.query.filter_by(correo=usuarios.correo).first()
        db.session.commit()
        token = create_access_token(identity={'id': user_aux.id, 'correo': user_aux.correo})
        user_aux.token_jwt = token
        if data['fk_rol'] ==1:
            if 'fk_anfitrion' not in data: #ANFITRION PADRE SOLO REQUIERE LA FOTO DE MANERA OBLIGATORIA
                user_aux.imagen = ruta_imagen
        db.session.commit()
        user_aux = Usuario.Schema().dump(user_aux)
        return respond({'usuario': user_aux}, True, 'Usuario registrado')
    else:
        return respond('', False, 'El correo o username ya en uso.')        




@usuarios.route('/api/usuario/registrar_anfitrion_evento', methods=['POST'])
@try_except
def registrar_usuario_evento_web():
    data =json.loads(request.form['body'])
    # data =json.loads(request.form['body'])
    respuesta_usuario = registrar_usuario_web(data["anfitrion"])
    # return 2 el username o email repetido
    # return 1 falta imagen
    if respuesta_usuario == 1 : 
        return respond(None, False, 'Falta seleccionar un logo para el usuario')
    elif respuesta_usuario == 2: 
        return respond('', False, 'El correo o usuario ya está en uso.')     
    else : 
        #registrar Evento
        if 'planID' in data["evento"]:
            categoria = data["evento"]['planID']
        else : 
            categoria =1
        respuesta_evento = insertar_evento_web(data["evento"],respuesta_usuario['id'],categoria)
        if respuesta_evento == 1 : 
            return respond(None, False, 'Falta seleccionar una imagen para el evento')
        else : 
            ID_PARAMETRO_CANTIDAD_GUARDIAS =2
            planes = AsignacionParametrosPlanes.query.filter_by(fk_plan=categoria).filter_by(fk_parametro=ID_PARAMETRO_CANTIDAD_GUARDIAS).first()
            cantidad = planes.valor_parametro
            lista_porteros = generar_porteros(cantidad,respuesta_usuario['id'],data['evento']['nombre_evento'],respuesta_usuario['imagen'],data['anfitrion']['pais'],respuesta_usuario['apellidos'])
            respuesta_final = [respuesta_usuario,respuesta_evento,lista_porteros]
            enviar_correo(respuesta_usuario['correo'],respuesta_usuario,respuesta_evento,lista_porteros)
            return respond({'respuesta': respuesta_final}, True, 'Usuario y evento registrado correctamente.')


@usuarios.route('/api/usuario/registrar_evento_web', methods=['POST'])
@try_except
def registrar_evento_web():
    data =json.loads(request.form['body'])
    # data =json.loads(request.form['body'])
    respuesta_usuario = Usuario.query.filter_by(id=data['fk_anfitrion']).first()
    if respuesta_usuario.fk_anfitrion !=None: #ES ANFITRION HIJO, POR ENDE OBTENEMOS EL PADRE
        respuesta_usuario = Usuario.query.filter_by(id=respuesta_usuario.fk_anfitrion)
        #registrar Evento
    categoria = data["evento"]['planID']

    respuesta_evento = insertar_evento_web(data["evento"],respuesta_usuario.id,categoria)
    if respuesta_evento == 1 : 
        return respond(None, False, 'Falta seleccionar una imagen para el evento')
    else : 
        return respond({'respuesta': respuesta_evento}, True, 'Evento registrado correctamente.')
@try_except
def insertar_evento_web(data,usuario_id,categoria=None):
    if 'imagen' in data:
        #  image = base64.b64decode(str(data['imagen']))       
         path_imagen = './common/resources/images/eventos/'
         ruta_imagen = getI420FromBase64(str(data['imagen']),path_imagen)
    else:
        return 1 
    anho = data['fecha_inicio'][6:10]    
    mes =  data['fecha_inicio'][3:5]   
    dia = data['fecha_inicio'][0:2] 
    fecha_inicio = datetime(int(anho), int(mes), int(dia))
    anho = data['fecha_fin'][6:10]    
    mes =  data['fecha_fin'][3:5]   
    dia = data['fecha_fin'][0:2] 
    fecha_fin = datetime(int(anho), int(mes), int(dia))
    cantidad_invitados = 0
    habilitado = 0
    ID_PARAMETRO_CANTIDAD_INVITADOS = 1

    if categoria!=None:
        planes = AsignacionParametrosPlanes.query.filter_by(fk_plan=categoria).filter_by(fk_parametro=ID_PARAMETRO_CANTIDAD_INVITADOS).first()
    else :
        categoria =1
        planes = AsignacionParametrosPlanes.query.filter_by(fk_plan=categoria).filter_by(fk_parametro=ID_PARAMETRO_CANTIDAD_INVITADOS).first()
    cantidad_invitados = planes.valor_parametro
    if cantidad_invitados ==0:
        cantidad_invitados =600
    if categoria==1:
        habilitado = 1
    else:
        habilitado = 0
    descripcion = ''
    if data['descripcion'] =='' or data['descripcion'] ==None:
        descripcion = ''
    else:
        descripcion = data['descripcion'] 
    evento = Evento(data['nombre_evento'],descripcion,fecha_inicio,data['hora_inicio'],fecha_fin,data['hora_fin'],data['plan'],data['privacidad'],cantidad_invitados,usuario_id,data['tipo'],'Bolivia',data['nombre_lugar'],data['direccion'],data['link_maps'],habilitado,categoria)
    evento.imagen = ruta_imagen
    db.session.add(evento)
    db.session.commit()
    evento_aux = Evento.Schema().dump(evento)
    id = evento_aux['id']
    asignacion = AsignacionEvento(usuario_id,evento_aux['id'])
    db.session.add(asignacion)
    db.session.commit()
    categoria = CategoriaInvitado('Estándar','#FFFFFF',evento.id)
    db.session.add(categoria)    
    return evento_aux

@try_except
def getI420FromBase64(codec, image_path):
    base64_data = re.sub('^data:image/.+;base64,', '', codec)
    byte_data = base64.b64decode(base64_data)
    image_data = BytesIO(byte_data)
    img = Image.open(image_data)
    t = str(uuid.uuid4())
    respuesta =image_path + str(t) + '.png'
    img.save(respuesta, "PNG")
    respuesta = respuesta[1:]
    return respuesta
    
@try_except
def registrar_usuario_web(data):
    if 'logo' in data:
        # ruta_imagen = guardar_imagen('usuarios', request.files['imagen'])
        # image = base64.b64decode(str(data['logo']))       
        path_logo = './common/resources/images/anfitriones/'
        if data['logo']=='':
            ruta_logo=None
        else:
            ruta_logo = getI420FromBase64(str(data['logo']),path_logo)

    else:
        return 1 
    password = data['nombres']+get_random_string(3)
    username =data['correo']
    pass_aux =  hashlib.sha512(password.encode()).hexdigest()
    fk_rol = 1  # USUARIO ANFITRION
    usuarios = Usuario(data['nombres'], data['apellidos'], data['telefono'], data['correo'],pass_aux,fk_rol,username,None ,data['boletin'],data['pais'])
    email = Usuario.query.filter_by(correo=usuarios.correo).first()
    username = Usuario.query.filter_by(username=usuarios.username).first()
    if email == None and username ==None:
        db.session.add(usuarios)
        db.session.commit()
        user_aux = Usuario.query.filter_by(correo=usuarios.correo).first()
        token = create_access_token(identity={'id': user_aux.id, 'correo': user_aux.correo})
        user_aux.token_jwt = token
        user_aux.imagen = ruta_logo
        db.session.merge(user_aux)
        db.session.commit()
        user_aux = Usuario.Schema().dump(user_aux)
        user_aux['contrasenha'] = password
        return user_aux
        # return 9
    else:
        return 2      


def generar_porteros(cantidad,fk_anfitrion,nombre_evento,logo,pais,apellidosPadre):
    lista_porteros = []
    for i in range(cantidad):
        correo_fake = get_random_string(12)
        password = apellidosPadre+get_random_string(3)
        username = apellidosPadre+get_random_string(3)
        pass_aux =  hashlib.sha512(password.encode()).hexdigest()
        fk_rol = 2
        usuarios = Usuario(nombre_evento, 'seguridad', 000, correo_fake,pass_aux,fk_rol,username,fk_anfitrion,False,pais)
        email = Usuario.query.filter_by(correo=usuarios.correo).first()
        username = Usuario.query.filter_by(username=usuarios.username).first()
        if email == None and username ==None:
            db.session.add(usuarios)
            user_aux = Usuario.query.filter_by(correo=usuarios.correo).first()
            db.session.commit()
            token = create_access_token(identity={'id': user_aux.id, 'correo': user_aux.correo})
            user_aux.token_jwt = token
            user_aux.imagen = logo
            db.session.commit()
            user_aux = Usuario.Schema().dump(user_aux)
            user_aux['contrasenha'] = password
            # return user_aux
            lista_porteros.append(user_aux)
        else:
            return 2    
    return lista_porteros  

@try_except
def enviar_correo(destinatario,anfitrion,evento,porteros):
        data = request.json
        privacidad_evento=''
        string_descripcion=''
        plan = ''
        print(evento['tipo'])
        if evento['tipo']==0:
            privacidad_evento =  'Público'
        if evento['tipo']==1:
            privacidad_evento =  'Privado'
        if evento['descripcion'] !='' and evento['descripcion'] !=None:
            string_descripcion = 'Descripción del evento: '+evento['descripcion']+'<br>'
        string_fecha_inicio = evento['fecha_inicio'][:10]+' '+evento['hora_inicio']
        string_fecha_fin = evento['fecha_fin'][:10]+' '+evento['hora_fin']
        string_anfritrion = 'Has completado tu registro con éxito.<br>Puedes iniciar sesión en <a href="https://app.ventu.vip/">app.ventu.vip</a> con tu correo: '+anfitrion['correo']+' y tu clave: '+anfitrion['contrasenha']+'<br>'
        string_evento= 'Inicia sesión y podrás ver los guardias que hemos creado, incluidos en tu paquete, así como el evento que creaste.<br><br>Si tienes algunda duda o consulta, escríbenos a info@ventu.vip o al WhatsApp +59172101994.<br><br>¡Que disfrutes la experiencia Ventu!<br>'        
        string_portero ='Se ha registrado '+str(len(porteros))+' guardia/s   con los siguientes datos:<br>'
        string_portero = ''
        correo = enviar_email_registro_web('Ventu - Registro completado con éxito', destinatario,string_portero ,string_anfritrion,string_evento,'¡Bienvenido a Ventu!')
        return {'data': '', 'success': True, 'message': 'Correo enviado correctamente'}


@usuarios.route('/usuario/obtener_anfitriones/<int:id_usuario>')
#@token_required
@try_except
def obtener_anfitriones(id_usuario):
    usuario_aux = Usuario.query.filter_by(id=id_usuario).first()
    if usuario_aux.fk_anfitrion == None:
        anfitrion_padre = usuario_aux
        anfitriones_hijos = Usuario.query.filter_by(fk_anfitrion=id_usuario).filter_by(fk_rol=1).all()
    else : 
        anfitrion_padre = Usuario.query.filter_by(id=usuario_aux.fk_anfitrion).first()
        anfitriones_hijos = Usuario.query.filter_by(fk_anfitrion=anfitrion_padre.id).filter_by(fk_rol=1).all()
    respuesta = {
        "anfitrion_padre":Usuario.Schema().dump(anfitrion_padre),
        "anfitriones_hijos":Usuario.Schema(many=True).dump(anfitriones_hijos),
    }
    return respond(respuesta, True, 'Anfitriones obtenidos correctamente.')

@usuarios.route('/usuario/obtener_relacionadores/<int:id_usuario>')
#@token_required
@try_except
def obtener_relacionadores(id_usuario):
    usuario_aux = Usuario.query.filter_by(id=id_usuario).first()
    if usuario_aux.fk_anfitrion == None:
        relacionadores = Usuario.query.filter_by(fk_anfitrion=id_usuario).filter_by(fk_rol=3).all()
    else : 
        anfitrion_padre = Usuario.query.filter_by(id=usuario_aux.fk_anfitrion).first()
        relacionadores = Usuario.query.filter_by(fk_anfitrion=anfitrion_padre.id).filter_by(fk_rol=3).all()
    respuesta = Usuario.Schema(many=True).dump(relacionadores)
    return respond(respuesta, True, 'Relacionadores obtenidos correctamente.')

@usuarios.route('/usuario/obtener_guardias/<int:id_usuario>')
#@token_required
@try_except
def obtener_guardias(id_usuario):
    # anfitrion_padre = Usuario.query.filter_by(id=id_usuario).one()
    usuario_aux = Usuario.query.filter_by(id=id_usuario).first()
    if usuario_aux.fk_anfitrion == None:
        guardias = Usuario.query.filter_by(fk_anfitrion=id_usuario).filter_by(fk_rol=2).all()
    else :
        anfitrion_padre = Usuario.query.filter_by(id=usuario_aux.fk_anfitrion).first()
        guardias = Usuario.query.filter_by(fk_anfitrion=anfitrion_padre.id).filter_by(fk_rol=2).all()
    respuesta = Usuario.Schema(many=True).dump(guardias)
    return jsonify({'data': respuesta, 'success': True, 'message': 'Guardias obtenidos correctamente.'})

@usuarios.route('/usuario/eliminar', methods=['POST'])
@try_except
#@token_required
def eliminar_usuario():
        data = request.json
        usuario = Usuario.query.get(str(data['id_usuario']))
        if usuario is not None:
            if usuario.fk_rol==1 and usuario.fk_anfitrion ==None:
                return jsonify({'data': None, 'success': False, 'message': 'No es posible eliminar un anfitrion padre.'})
            else:
                if  usuario.fk_rol==2 or  usuario.fk_rol==3 :
                    asignaciones = AsignacionEvento.query.filter_by(fk_usuario=str(data['id_usuario'])).all()
                    for asignacion in asignaciones:
                        db.session.delete(asignacion)
                    if usuario.fk_rol ==3:
                        parametros_relacionadores = ParametosRelacionadorXCategorias.query.filter_by(fk_usuario=usuario.id).all()
                        for parametro in parametros_relacionadores:
                            db.session.delete(parametro)
                db.session.delete(usuario)
                db.session.commit()
                return jsonify({'data': Usuario.Schema().dump(usuario), 'success': True, 'message': 'Usuario eliminada'})
        else : 
            return jsonify({'data': None, 'success': False, 'message': 'Categoria no encontrada'})


@usuarios.route('/usuario/editar', methods=['PUT'])
##@token_required
@try_except
def editar_usuario():    
    data =json.loads(request.form['body'])
    usuario = Usuario.query.get(data['id_usuario'])
    if usuario is not None:
        if 'correo' in data:
            email = Usuario.query.filter_by(correo=data['correo']).filter(Usuario.id!=data['id_usuario']).first()
        else :
            email = None
        if 'username' in data : 
            username = Usuario.query.filter_by(username=data['username']).filter(Usuario.id!=data['id_usuario']).first()
        else : 
            username = None
        if email == None and username == None:        
            usuario.nombres =data['nombres']
            usuario.apellidos =data['apellidos']
            usuario.telefono =data['telefono']
            if 'contrasenha' in data:
                if data['contrasenha']!=None and data['contrasenha']!='':
                    usuario.contrasenha =hashlib.sha512(data['contrasenha'].encode()).hexdigest()
            if usuario.fk_rol == 1 : #USUARIO ANFITRION
                usuario.correo =data['correo']
                if usuario.fk_anfitrion ==None: #ANFITRION PADRE
                    usuario.boletin =data['boletin']
                    usuario.pais =data['pais']
                    if 'imagen' in request.files and request.files['imagen'].filename != '':
                        ruta_imagen = guardar_imagen('usuarios', request.files['imagen'])
                        usuario.imagen = ruta_imagen
                # else :
                #     print('Editando usuario anfitrion hijo')   #USUARIO ANFITRION HIJO
            if usuario.fk_rol ==2 : #USUARIO PORTERO
                usuario.username =data['username']      
            if usuario.fk_rol ==3 : #USUARIO PORTERO
                usuario.username =data['username']               
            db.session.merge(usuario)
            db.session.commit()
            return respond(Usuario.Schema().dump(usuario), True, 'Usuario editado correctamente')
        else:
            return respond('', False, 'El correo o username ya en uso.')        
    else:
        return respond(None, False, 'Invitado no encontrado')

