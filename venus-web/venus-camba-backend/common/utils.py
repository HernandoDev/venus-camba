import traceback
from typing import final
#from typing_extensions import Literal
from flask import jsonify, request
from datetime import datetime
import time
import pytz
import os
import uuid
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formataddr
from email.mime.base import MIMEBase
from src.usuarios.models import Usuario
import logging
import random
import string

def try_except(function):
    def wrapper(*args, **kwargs):
        try:
            start = time.time()
            return function(*args, **kwargs)
        except Exception as e:
            logging.error(traceback.format_exc()+'Exception happens on: '+datetime.now(pytz.timezone('America/La_Paz')).strftime('%d/%m/%Y %I:%M:%S %p (UTC%Z)')+"\n")
            traceback.print_exc()
            return jsonify({'data': str(e), 'success': False, 'message': 'Ocurrió un error en el servidor'})
        finally:
            end = time.time()
            if (end-start) > 2:
                print('Function:', function, '\nTime for code to run:', round(end-start, 2), 'segs')
                aux ='Function:'+str(function)+ '\nTime for code to run:', round(end-start, 2), 'segs'
                logging.warning(str(aux))
                logging.warning('TAKING TOO LONG TO RUN!') if (end-start) > 5 else None
                print('TAKING TOO LONG TO RUN!') if (end-start) > 5 else None
                    
    wrapper.__name__ = function.__name__
    return wrapper


def token_required(function):
    def wrapper(*args, **kwargs):
        token = request.headers.environ.get('HTTP_AUTHORIZATION', 'No token')
        token_valido = Usuario.validar_token(token)
        if token_valido:
            return function(*args, **kwargs)
        else:
            print('Error 403, token invalido')
            return jsonify({'data': 'Error 403, token invalido', 'success': False, 'message': 'Error 403, token invalido'})
    wrapper.__name__ = function.__name__
    return wrapper


def respond(data, success, message):
    return jsonify({'data': data, 'success': success, 'message': message})




def guardar_imagen(carpeta,imagen):
    nombre = imagen.filename
    extension = os.path.splitext(nombre)[1]
    nuevo_nombre = str(uuid.uuid4()) + extension
    ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
    carpeta_existente = os.path.exists(os.path.join(
        ROOT_DIR, 'resources', 'images', carpeta))
    if not carpeta_existente:
        os.makedirs(os.path.join(ROOT_DIR, 'resources', 'images', carpeta))
    imagen.save(os.path.join(ROOT_DIR, 'resources',
                'images', carpeta, nuevo_nombre))
    ruta = '/common/resources/images/' + carpeta + '/' + nuevo_nombre
    return ruta

def guardar_archivo(carpeta,imagen):
    nombre = imagen.filename
    extension = os.path.splitext(nombre)[1]
    nuevo_nombre = str(uuid.uuid4()) + extension
    ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
    carpeta_existente = os.path.exists(os.path.join(
        ROOT_DIR, 'resources',  carpeta))
    if not carpeta_existente:
        os.makedirs(os.path.join(ROOT_DIR, 'resources', carpeta))
    imagen.save(os.path.join(ROOT_DIR, 'resources',
                 carpeta, nuevo_nombre))
    ruta = '/common/resources/' + carpeta + '/' + nuevo_nombre
    return ruta

def enviar_email(asunto, nombre,telefono,email,consulta, destinatarios, cabecera):
    CORREO_ORIGEN = 'info@ventu.vip'
    CORREO_KEY = "MX4Q1@ma5##j"
    asunto = asunto
    cabecera = cabecera

    try:
        server = smtplib.SMTP_SSL('mail.privateemail.com', '465')
        server.ehlo()
        server.login('info@ventu.vip', CORREO_KEY)

        msg = MIMEMultipart('alternative')
        msg['From'] = formataddr(
            (str(Header('VENTU', 'utf-8')), CORREO_ORIGEN))
        msg['To'] = "mí"
        msg["Subject"] = asunto

        text = "Ventu notifica que hay un nuevo formulario de contacto \n"
        html = '   <html>\
                                      <body>\
                                          <div id="Container"> \
                                              <h2>' + cabecera + '</h2></br> \
                                              <p>' + 'Nombre Completo: ' + nombre + '</p></br> \
                                              <p>' + 'Teléfono: ' + telefono + '</p></br> \
                                              <p>' + 'Correo: ' + email + '</p></br> \
                                              <p>' + 'Consulta: ' + consulta + '</p></br> \
                                          </br>\
                                          </div>\
                                      </body>\
                                  </html>'

        parte1 = MIMEText(text, 'plain')
        parte2 = MIMEText(html, 'html')
        msg.attach(parte1)
        msg.attach(parte2)

        msg._headers[3] = ('To', destinatarios)
        server.sendmail(CORREO_ORIGEN, destinatarios, msg.as_string())
        return True
    except Exception as e:
        print(e)
        return False
    finally:
        server.quit()
def get_random_string(length):
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str


def enviar_email_registro_web(asunto,destinatarios, string_portero,string_anfritrion,string_evento , cabecera):
    CORREO_ORIGEN = 'info@ventu.vip'
    CORREO_KEY = "MX4Q1@ma5##j"
    asunto = asunto
    cabecera = cabecera

    try:
        server = smtplib.SMTP_SSL('mail.privateemail.com', '465')
        server.ehlo()
        server.login('info@ventu.vip', CORREO_KEY)

        msg = MIMEMultipart('alternative')
        msg['From'] = formataddr(
            (str(Header('VENTU', 'utf-8')), CORREO_ORIGEN))
        msg['To'] = "mí"
        msg["Subject"] = asunto

        text = "Ventu notifica que hay un nuevo formulario de contacto \n"
        html = '   <html>\
                                      <body>\
                                          <div id="Container"> \
                                              <h2>' + cabecera + '</h2></br> \
                                              <p>'  + string_anfritrion + '</p></br> \
                                              <p>'  + string_portero + '</p></br> \
                                              <p>'  + string_evento + '</p></br> \
                                          </br>\
                                          </div>\
                                      </body>\
                                  </html>'

        parte1 = MIMEText(text, 'plain')
        parte2 = MIMEText(html, 'html')
        msg.attach(parte1)
        msg.attach(parte2)

        msg._headers[3] = ('To', destinatarios)
        server.sendmail(CORREO_ORIGEN, destinatarios, msg.as_string())
        return True
    except Exception as e:
        print(e)
        return False
    finally:
        server.quit()
