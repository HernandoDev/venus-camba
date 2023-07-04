from flask import Blueprint, jsonify, request
from utilities import database as db
from common.utils import enviar_email, try_except


landing = Blueprint('landing', __name__)

@landing.route('/enviar_correo', methods=['POST'])
@try_except
def enviar_correo():
    try:
        data = request.json
        correo = enviar_email('Ventu - Formulario de contacto', data['nombre_completo'], data['telefono'], data['email'], data['consulta'], 'info@ventu.vip', '¡Tienes un nuevo potencial cliente para Ventu!')
        return jsonify({'data': '', 'success': True, 'message': 'Correo enviado correctamente'})
    except Exception as e:
        return jsonify({'data': str(e), 'success': False, 'message': 'Ocurrió un error en el servidor'})