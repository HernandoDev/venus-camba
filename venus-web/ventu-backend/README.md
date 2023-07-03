# Ventu Backend Rest API Application 
Rest API del gestor de evenetos Ventu usando Flask 1.1 y SQLAlchemy 1.3
<br>
<br>

***

## Configurar el proyecto en local
Para configurar el proyecto de manera local se debe seguir los siguientes pasos.   <br/><br/>

```bash
python -m venv venv
pip install -r requirements.txt
```

***

## Correr el proyecto

Para correr el proyecto ejecutamos el comando `python app.py` en la raiz del proyecto.
<br>
<br>
NOTA: La cadena de conexi�n se encuentra en el archivo <strong>settings.py</strong> con el nombre de SQLALCHEMY_DATABASE_URI, para correr el proyecto es necesario modifcar esta cadena con las credenciales adecuadas de MySQL y tener una base de datos existente con el nombre indicado en dicha cadena en este caso <b>ventu_db</b>.

***
## Migraciones
### Generar una migración
Cuando realizamos cambios en los modelos de SQLAlchemy, podemos generar una migración para que automaticamente se detecten estos cambios y se guarden en un archivo denominado "migración" donde debemos ponerle un nombre.
```bash
flask db migrate -m "Agregada columna carnet_identidad"
```
Si no existe ningún cambio en los modelos, no se generará ninguna migración y en caso de que necesitemos generar una migración vacía para escribir cambios manuales ahi, lo hacemos de la siguiente forma
```bash
flask db revision -m "Insertar paises"
```
Donde nos creará un archivo de migración vacío y podremos escribir operaciones SQL manualmente utilizando alembic. https://alembic.sqlalchemy.org/en/latest/ops.html
<br>
<br>
### Actualizar la base de datos
Cuando tenemos migraciones nuevas generadas, podemos aplicar estos cambios a nuestra base de datos utilizando el commando
```bash
flask db upgrade
```
En caso de necesitar revertir una migración podemos correr el comando
```bash
flask db downgrade
```