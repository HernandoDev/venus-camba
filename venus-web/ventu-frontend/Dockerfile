# Utiliza una imagen base que incluya Node.js y Angular
FROM node:18

# Instala Python y otras dependencias
RUN apt-get update && \
    apt-get install -y python

# Copia los archivos de la aplicación Angular
COPY . /app

# Establece el directorio de trabajo
WORKDIR /app

# Instala las dependencias de Node.js
RUN npm install
RUN npm install -g @angular/cli

# Expone el puerto 4200
EXPOSE 4200

# Ejecuta el comando para iniciar el servidor Angular
CMD ng serve --host 0.0.0.0
