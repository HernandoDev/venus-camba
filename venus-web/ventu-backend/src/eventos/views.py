from flask import Blueprint, jsonify, request

from utilities import database as db
from src.eventos.models import AsignacionEvento, Evento,BitacoraEventos
from src.invitados.models import Invitado, ParametosRelacionadorXCategorias
from src.categorias_invitados.models import CategoriaInvitado
from sqlalchemy import func

from src.usuarios.models import *
from datetime import date
from src.planes.models import Planes,AsignacionParametrosPlanes,ParametrosPlanes
import datetime

from common.utils import guardar_imagen, respond, token_required, try_except
import json
import pytz

eventos = Blueprint('eventos', __name__)
@eventos.route('/listar', methods=['POST'])
#@token_required
@try_except
def obtener_eventos():
    usuario_id = request.json
    usuario = Usuario.query.get(usuario_id)
    lista_eventos_aux=[]
    array_aux_asiganciones = []
    if usuario is not None:    
        if usuario.fk_rol==1 and usuario.fk_anfitrion ==None: #USUARIO ANFITRION PADRE
            lista_eventos = Evento.query.filter_by(soft_delete_activado=0).join(AsignacionEvento).filter_by(fk_usuario=usuario_id).order_by(Evento.fecha_inicio.desc())
        else: #USUARIO ANFITRION HIJO
            anfitrion_padre = Usuario.query.get(usuario.fk_anfitrion)
            lista_eventos = Evento.query.filter_by(soft_delete_activado=0).join(AsignacionEvento).filter_by(fk_usuario=anfitrion_padre.id).order_by(Evento.fecha_inicio.desc())
    if usuario.fk_rol==2:#busando validar el usurio portero paara aginaciones
            lista_eventos = Evento.query.filter_by(soft_delete_activado=0).join(AsignacionEvento).filter_by(fk_usuario=usuario_id).order_by(Evento.fecha_inicio.desc())
    for evento in lista_eventos:
        # results = Invitado.query.filter_by(fk_evento = evento.id).all()
        total_ingresos = db.session.query(func.sum(Invitado.ingresos)).filter_by(fk_evento=evento.id).scalar()
        total_acompanhantes = db.session.query(func.sum(Invitado.acompanhantes)).filter_by(fk_evento=evento.id).scalar()
        total_invitados =  Invitado.query.filter_by(fk_evento=evento.id).count()
        if total_invitados==None:
            total_invitados =0
        if total_acompanhantes==None:
            total_acompanhantes =0            
        if total_ingresos==None:
            total_ingresos =0

        for asignacion in evento.Planes.AsignacionParametrosPlanes:
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
        evento_aux= Evento.Schema(many=False).dump(evento)
        aux_plan ={
                'id':evento.Planes.id,
                'nombre':evento.Planes.nombre,
                'precio':evento.Planes.precio,
                'asignacion_plan':array_aux_asiganciones,
        }
        evento_aux['plan']=aux_plan
        evento_aux['total_ingresos']=int(total_ingresos)
        evento_aux['total_invitados']=int(total_invitados)
        evento_aux['total_acompanhantes']=int(total_acompanhantes)
        total_acompanhantes
        lista_eventos_aux.append(evento_aux)
        array_aux_asiganciones=[]
    return jsonify( {'data': lista_eventos_aux, 'success': True, 'message': 'eventos obtenidos'})

@eventos.route('/obtener_bitacora_evento/<int:id_evento>')
#@token_required
@try_except
def obtener_bitacora_evento_x_id(id_evento):
    bitacora = BitacoraEventos.query.filter_by(fk_evento=id_evento).all()
    # bitacora_aux = BitacoraEventos.Schema(many=True).dump(bitacora[0])
    bitacoraDic = []
    for bitacora_aux in bitacora:
        aux = {
            'accion':bitacora_aux.accion,
            'fecha':bitacora_aux.fecha_creacion,
        }
        bitacoraDic.append(aux)
    return jsonify( {'data': bitacoraDic, 'success': True, 'message': 'Bitacora del evento obtenida correctamente.'})



@eventos.route('/<int:id_evento>')
#@token_required
@try_except
def obtener_evento_x_id(id_evento):
    array_aux_asiganciones = []
    evento = Evento.query.filter_by(soft_delete_activado=0).filter_by(id=id_evento).first()

    if evento is not None:
        invitados = Invitado.query.filter_by(fk_evento=id_evento).all()
        asignaciones = AsignacionParametrosPlanes.query.filter_by(fk_plan=evento.Planes.id)
        for asignacion in evento.Planes.AsignacionParametrosPlanes:
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
                'id':evento.Planes.id,
                'nombre':evento.Planes.nombre,
                'precio':evento.Planes.precio,
                'asignacion_plan':array_aux_asiganciones,
        }
        evento = Evento.Schema().dump(evento)
        evento['plan']=aux_plan

        invitados = Invitado.Schema(many=True).dump(invitados)
        evento['invitados'] =  invitados
        return jsonify({'data': evento, 'success': True, 'message': 'Evento obtenido'})
    else:
        return jsonify({'data': None, 'success': False, 'message': 'Evento no encontrado'})
@eventos.route('/obtener_guardias_evento/<int:id_evento>')
#@token_required
@try_except
def obtener_guardias_evento(id_evento):
    evento = Evento.query.get(id_evento)
    guardias_no_asignados = []
    if evento is not None:
        #OBTENGO TODOS LOS GUARDIAS DEL EVENTO
        guardias = Usuario.query.filter_by(fk_anfitrion=evento.fk_usuario).filter_by(fk_rol=2).all()
        guardias = Usuario.Schema(many=True).dump(guardias)
        #OBTENER GUARDIAS PERTENECIENTES AL EVENTO
        guardias_asignados = Usuario.query.filter_by(fk_rol=2).join(AsignacionEvento).filter_by(fk_eventos=id_evento).all()
        guardias_asignados = Usuario.Schema(many=True).dump(guardias_asignados)
        response = {
            'guardias_asignados':guardias_asignados,
            'guardias':guardias,
        }
        for guardia_aux in guardias:
            encontrado = False
            for guarida_asignado_aux in guardias_asignados:
                if guarida_asignado_aux['id'] ==guardia_aux['id']:
                    encontrado=True
            if encontrado==False:    
                guardias_no_asignados.append(guardia_aux)
        response = {
            'guardias_asignados':guardias_asignados,
            'guardias':guardias_no_asignados,
        }
        return jsonify({'data': response, 'success': True, 'message': 'Guardias obtenidos'})
    else:
        return jsonify({'data': None, 'success': False, 'message': 'Evento no encontrado'})
    

@eventos.route('/obtener_relacionadores_evento/<int:id_evento>')
#@token_required
@try_except
def obtener_relacionadores_evento(id_evento):
    evento = Evento.query.get(id_evento)
    relacionadores_no_asignados = []
    if evento is not None:
        #OBTENGO TODOS LOS relacionadores DEL EVENTO
        relacionadores = Usuario.query.filter_by(fk_anfitrion=evento.fk_usuario).filter_by(fk_rol=3).all()
        relacionadores = Usuario.Schema(many=True).dump(relacionadores)
        #OBTENER relacionadores PERTENECIENTES AL EVENTO
        relacionadores_asignados = Usuario.query.filter_by(fk_rol=3).join(AsignacionEvento).filter_by(fk_eventos=id_evento).all()
        relacionadores_asignados = Usuario.Schema(many=True).dump(relacionadores_asignados)
        # contador_ingresos =0 
        contador_acompanhates=0
        contador_limite_invitados=0
        contador_comision_total = 0
        for relacionador_asignado_aux in relacionadores_asignados:
            invitados = Invitado.query.filter_by(fk_usuario=relacionador_asignado_aux['id']).filter_by(fk_evento= id_evento).all()
            parametros_relacionador = ParametosRelacionadorXCategorias.query.filter_by(fk_usuario=relacionador_asignado_aux['id']).filter_by(fk_evento= id_evento).all()
            for parametro in parametros_relacionador:
                contador_limite_invitados+=int(parametro.limite_invitados)
            for invitado in invitados:
                contador_acompanhates+=int(invitado.acompanhantes)+1
                for parametro in parametros_relacionador:
                    if parametro.fk_categoria == invitado.fk_categoria:
                        # contador_comision_total+=parametro.comision
                        contador_comision_total+= parametro.comision*(invitado.acompanhantes+1)
                # contador_ingresos+= invitado.ingresos
            relacionador_asignado_aux['contador_acompanhates'] = contador_acompanhates
            relacionador_asignado_aux['contador_limite_invitados'] = contador_limite_invitados
            relacionador_asignado_aux['contador_comision_total'] = contador_comision_total
            contador_comision_total = 0
            contador_acompanhates=0
            contador_limite_invitados=0
                
        for relacionadores_aux in relacionadores:
            encontrado = False
            for relacionadores_asignado_aux in relacionadores_asignados:
                if relacionadores_asignado_aux['id'] ==relacionadores_aux['id']:
                    encontrado=True
            if encontrado==False:    
                relacionadores_no_asignados.append(relacionadores_aux)
        response = {
            'relacionadores_asignados':relacionadores_asignados,
            'relacionadores':relacionadores_no_asignados,
        }
        return jsonify({'data': response, 'success': True, 'message': 'Relacionadores obtenidos'})
    else:
        return jsonify({'data': None, 'success': False, 'message': 'Evento no encontrado'})



@eventos.route('/editar_parametro_relacionador', methods=['POST'])
#@token_required
def editar_parametro_relacionador():
    data = request.json
    parametro_relacionador = ParametosRelacionadorXCategorias.query.filter_by(id=data['parametro']['id']).first()
    parametro_relacionador.comision= data['parametro']['comision']
    parametro_relacionador.limite_invitados= int(data['parametro']['limite_invitados'])
    db.session.merge(parametro_relacionador)
    db.session.commit()
    return jsonify({'data': '', 'success': True, 'message': 'Parametros actualizados'})


@eventos.route('/eliminar_asignacion_usuario', methods=['POST'])
#@token_required
def eliminar_asignacion_usuario():
    try:
        data = request.json
        evento = Evento.query.get(data['id_evento'])
        if evento is not None:
            asignacion = AsignacionEvento.query.filter_by(fk_usuario=data['id']).filter_by(fk_eventos=data['id_evento']).first()
            if asignacion!=None:
                db.session.delete(asignacion)
                usuario=Usuario.query.filter_by(id=data['id']).first()
                if usuario.fk_rol ==3:
                    parametros_relacionadores = ParametosRelacionadorXCategorias.query.filter_by(fk_usuario=usuario.id).filter_by(fk_evento=data['id_evento']).all()
                    for parametro in parametros_relacionadores:
                        db.session.delete(parametro)
                db.session.commit()
                return jsonify({'data': AsignacionEvento.Schema().dump(asignacion), 'success': True, 'message': 'Asignacion de guardia  eliminada'})
            else:
                return jsonify({'data': None, 'success': False, 'message': 'Error al encontrar la asignacion del guardia con el evento'})
        else:
            return jsonify({'data': None, 'success': False, 'message': 'Evento no encontrado'})
    except Exception as e:
        return jsonify({'data': str(e), 'success': False, 'message': 'Ocurrió un error en el servidor'})


@eventos.route('/asignar_guardia', methods=['POST'])
#@token_required
def asignar_guardia():
    try:
        data = request.json
        evento = Evento.query.get(data['id_evento'])
        if evento is not None:
            asignacion = AsignacionEvento(data['guardia']['id'], evento.id)
            db.session.add(asignacion)
            db.session.commit()
            return jsonify({'data': AsignacionEvento.Schema().dump(asignacion), 'success': True, 'message': 'Guardia asignado correctamente.'})
        else:
            return jsonify({'data': None, 'success': False, 'message': 'Evento no encontrado'})
    except Exception as e:
        return jsonify({'data': str(e), 'success': False, 'message': 'Ocurrió un error en el servidor'})

@eventos.route('/asignar_relacionador', methods=['POST'])
#@token_required
def asignar_relacionador():
    try:
        data = request.json
        evento = Evento.query.get(data['id_evento'])
        if evento is not None:
            asignacion = AsignacionEvento(data['relacionador']['id'], evento.id)
            categorias_invitado = CategoriaInvitado.query.filter_by(fk_evento=data['id_evento']).all()
            comision =20
            limite_invitados=10
            for categoria in categorias_invitado:
                parametro = ParametosRelacionadorXCategorias( data['relacionador']['id'], data['id_evento'],categoria.id,comision, limite_invitados)
                db.session.add(parametro)
            db.session.add(asignacion)
            db.session.commit()
            return jsonify({'data': AsignacionEvento.Schema().dump(asignacion), 'success': True, 'message': 'Relacionador asignado correctamente.'})
        else:
            return jsonify({'data': None, 'success': False, 'message': 'Evento no encontrado'})
    except Exception as e:
        return jsonify({'data': str(e), 'success': False, 'message': 'Ocurrió un error en el servidor'})


@eventos.route('/leer_evento', methods=['POST'])
#@token_required
@try_except
def leer_evento_x_id():
    data = request.json
    stringQR= str(data['id_evento'])
    isInt = isinstance(stringQR, int)
    if len(stringQR)<=5:
        isInt=True
    else :
        isInt = False
    if isInt==False:
        try:
            aux = stringQR.split(sep='.')
            id_invitado = int(aux[0], base=16)
            id_evento = int(aux[2], base=16)
        except Exception as e:
            return jsonify({'data': None, 'success': False, 'message': 'Evento no encontrado o QR inválido.'})
    else:
        id_evento= int(data['id_evento'])
    evento = Evento.query.get(id_evento)
    if evento is not None:
        fecha_actual = datetime.datetime.now()
        portero = Usuario.query.filter_by(username=data['username']).first()
        if portero!=None:
            asignacion_portero = AsignacionEvento.query.filter_by(fk_usuario=portero.id).filter_by(fk_eventos = id_evento).first()
            if asignacion_portero!=None:
                fecha_evento_fin =  evento.fecha_fin
                minutos = int(evento.hora_fin[3:5])
                horas = int(evento.hora_fin[:2])
                t = datetime.time(horas, minutos)
                fecha_evento_fin = datetime.datetime.combine(fecha_evento_fin.date(), t)
                fecha_evento_inicio =  evento.fecha_inicio
                minutos = int(evento.hora_inicio[3:5])
                horas = int(evento.hora_inicio[:2])
                #fecha_evento_inicio.replace(hour=int(horas), minute=int(minutos))            
                t = datetime.time(horas, minutos)
                fecha_evento_inicio = datetime.datetime.combine(fecha_evento_inicio.date(), t)
                if fecha_actual > fecha_evento_inicio and fecha_actual < fecha_evento_fin:
                    fk_usuario = evento.fk_usuario
                    evento = Evento.Schema().dump(evento)
                    evento['fk_usuario'] =  fk_usuario
                    if isInt==True:
                        invitados = Invitado.query.filter_by(fk_evento=id_evento).all()
                        invitados = Invitado.Schema(many=True).dump(invitados)
                        evento['invitados'] =  invitados
                        evento['invitadosLeido'] = None
                        return jsonify({'data': evento, 'success': True, 'message': 'Evento valido obtenido'})
                    else:
                        ##LOGICA PARA QR INDIVIDUAL LEER INVITADO SI ES VALIDO O NO.
                        invitado_leido = Invitado.query.get(id_invitado)
                        if invitado_leido is not None:
                            if invitado_leido.acompanhantes - invitado_leido.ingresos>-1:
                                evento['invitadosLeido'] = Invitado.Schema(many=False).dump(invitado_leido)
                                #INGRESAR INVITADO
                                invitado_leido.ingresos =invitado_leido.ingresos+1
                                db.session.merge(invitado_leido)
                                accion = 'Se ha registrado '+str(1)+' ingreso/s para  '+invitado_leido.nombres+' '+invitado_leido.apellidos+' por el usuario '+data["username"]
                                now_bolivia = datetime.datetime.now(pytz.timezone('America/La_Paz'))
                                bitacora = BitacoraEventos(accion,invitado_leido.fk_evento,1,now_bolivia)
                                db.session.add(bitacora)
                                db.session.commit()
                                # dictado_invitado =Invitado.Schema().dump(invitado_leido)
                                # data = {'dictado_invitado':dictado_invitado,'nombreEvento':evento['nombre'],'fk_evento':evento['id']}
                                # return jsonify({'data': data, 'success': True, 'message': 'Evento valido obtenido'})
                                return jsonify({'data': evento, 'success': True, 'message': 'Evento valido obtenido'})
                            else:
                                #EL INVITADO YA INGRESO
                                return jsonify({'data': None, 'success': False, 'message': 'Todos los ingresos del invitado '+invitado_leido.nombres+' '+invitado_leido.apellidos+' y sus acompañantes ya han sido registrados previamente.'})
                        else:
                                #invitado no encontrado
                            return jsonify({'data': None, 'success': False, 'message': 'No se pudo encontrar el invitado.'})
                else:
                    return jsonify({'data': evento.nombre, 'success': False, 'message': 'El evento no corresponde a esta fecha.'})
            else:
                return jsonify({'data': evento.nombre, 'success': False, 'message': 'El guardia no esta asignado al evento'})
        else:
            return jsonify({'data': evento.nombre, 'success': False, 'message': 'Guardia no encontrado'})
    else:
        return jsonify({'data': None, 'success': False, 'message': 'Evento no encontrado o QR inválido.'})


@eventos.route('/insertar', methods=['POST'])
#@token_required
@try_except
def insertar_evento():
    data = json.loads(request.form['body'])
    if 'imagen' in request.files and request.files['imagen'].filename != '':
        ruta_imagen = guardar_imagen('eventos', request.files['imagen'])
    else:
        return respond(None, False, 'Falta seleccionar una imagen')
    anho = data['fecha_inicio'][6:10]    
    mes =  data['fecha_inicio'][3:5]   
    dia = data['fecha_inicio'][0:2] 
    fecha_inicio = datetime.datetime(int(anho), int(mes), int(dia))
    anho = data['fecha_fin'][6:10]    
    mes =  data['fecha_fin'][3:5]   
    dia = data['fecha_fin'][0:2] 
    fecha_fin = datetime.datetime(int(anho), int(mes), int(dia))
    cantidad_invitados = 0
    if data['plan']=='Silver':
        cantidad_invitados = 150
        habilitado = 0
    if data['plan'] == 'Free':
        cantidad_invitados == 40
        habilitado = 1
    if data['plan'] == 'Gold':
        cantidad_invitados == 600
        habilitado = 0
    descripcion = ''
    if data['descripcion'] =='' or data['descripcion'] ==None:
        descripcion = ''
    else:
        descripcion = data['descripcion'] 
    evento = Evento(data['nombre_evento'],descripcion,fecha_inicio,data['hora_inicio'],fecha_fin,data['hora_fin'],data['plan'],data['tipo'],cantidad_invitados,data['id_usuario'],data['tipo_evento'],data['pais'],data['nombre_lugar'],data['direccion'],data['link_maps'],habilitado)

    evento.imagen = ruta_imagen
    db.session.add(evento)
    db.session.commit()
    evento_aux = Evento.Schema().dump(evento)
    id = evento_aux['id']
    asignacion = AsignacionEvento(data['id_usuario'],evento_aux['id'])
    db.session.add(asignacion)
    categoria = CategoriaInvitado('Estándar','#FFFFFF',evento.id)
    db.session.add(categoria)
    db.session.commit()
    
    return respond(evento_aux, True, 'Evento insertado correctamente.')

@eventos.route('/editar', methods=['PUT'])
#@token_required
@try_except
def editar_evento():    
    data = json.loads(request.form['body'])
    evento = Evento.query.get(data['id'])
    if evento is not None:
        if 'imagen' in request.files and request.files['imagen'].filename != '':
            ruta_imagen = guardar_imagen('producto', request.files['imagen'])
        else:
            ruta_imagen = evento.imagen
        evento.nombre = data.get('nombre', evento.nombre)
        evento.descripcion = data.get('descripcion',evento.descripcion)
        anho = data['fecha_inicio'][6:10]    
        mes =  data['fecha_inicio'][3:5]   
        dia = data['fecha_inicio'][0:2] 
        # nueva_fecha_inicio = datetime.datetime(int(anho), int(mes), int(dia))
        # evento.fecha_inicio = nueva_fecha_inicio
        evento.hora_inicio = data.get('hora_inicio',evento.hora_inicio)
        anho = data['fecha_fin'][6:10]    
        mes =  data['fecha_fin'][3:5]   
        dia = data['fecha_fin'][0:2] 
        # nueva_fecha_fin = datetime.datetime(int(anho), int(mes), int(dia))        
        # evento.fecha_fin =nueva_fecha_fin
        evento.hora_fin = data.get('hora_fin',evento.hora_fin)
        evento.categoria = data.get('categoria',evento.categoria)
        evento.tipo = data.get('tipo',evento.tipo)
        evento.cantidad_invitados = data.get('cantidad_invitados',evento.cantidad_invitados)
        evento.nombre_lugar = data.get('nombre_lugar',evento.nombre_lugar)
        evento.direccion = data.get('direccion',evento.direccion)
        evento.link_google = data.get('link_google',evento.link_google)
        evento.imagen = ruta_imagen
        db.session.merge(evento)
        db.session.commit()
        return respond(Evento.Schema().dump(evento), True, 'Evento editado correctamente')
    else:
        return respond(None, False, 'Evento no encontrado')


@eventos.route('/<int:id_evento>', methods=['DELETE'])
#@token_required
def eliminar_evento(id_evento):
    try:
        evento = Evento.query.get(id_evento)
        if evento is not None:
            evento.soft_delete_activado=1
            db.session.merge(evento)
            db.session.commit()
            return jsonify({'data': Evento.Schema().dump(evento), 'success': True, 'message': 'Evento eliminado'})
        else:
            return jsonify({'data': None, 'success': False, 'message': 'Evento no encontrado'})
    except Exception as e:
        return jsonify({'data': str(e), 'success': False, 'message': 'Ocurrió un error en el servidor'})

