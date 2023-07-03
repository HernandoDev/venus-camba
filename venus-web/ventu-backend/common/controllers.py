from flask import Blueprint, jsonify, send_file, abort
from datetime import datetime

from common.utils import try_except, token_required

common = Blueprint('common', __name__)

@common.route('/resources/images/<carpeta>/<imagen>')
def obtener_imagen(carpeta,imagen):
    path = 'common/resources/images/'+carpeta+'/'+imagen
    try:
        return send_file(path)
    except:
        abort(404)

@common.route('/fecha_hora')
def obtener_fecha_hora():
    return jsonify({'message': 'Fecha y hora actual del servidor', 'fecha': datetime.now().strftime('%d/%m/%Y'), 'hora': datetime.now().strftime('%I:%M:%S %p')})

