# Usa una imagen base con Python preinstalado
FROM python:3.7.9

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . /app

# Instala las dependencias del proyecto
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install importlib
RUN pip install opencv-python-headless
RUN pip install cryptography
# Expone el puerto en el que se ejecutará la aplicación Flask
EXPOSE 5000

# Define el comando para ejecutar la aplicación
# CMD flask run --host=0.0.0.0 --port=5000
# CMD ["python", "app.py"]
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000", "--reload"]

