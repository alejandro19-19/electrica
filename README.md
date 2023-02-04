# Mande - Proyecto Bases de Datos
***
## Integrantes: 
  * Alejandro Peñaranda Agudelo - 1941008
  * Alejandro Escobar Tafurt - 1941378
  * Juan Camilo Santa Gomez - 1943214


## Instalación
***
Pasos preliminares:
```
- Instalar postgresql 15
- Instalar nodeJS version 18
- Clonar el repositorio con el siguiente comando:

$ git clone https://github.com/alejandro19-19/electrica.git

```
Pasos para crear la base de datos con los modelos del backend:
```
python manage.py makemigrations
python manage.py migrate
```
Pasos para ejecutar el Backend:
```
Primero se debe ir al archivo settings.py que se encuentra en el direcctorio /Electrica_backend/electrica_api/settings.py, dentro de él 
se debe modificar el password que esta asignado en la base de datos por el que se tenga asignado para postgresql. Ademas si su usuario de postgresql es diferente
a "postgres" tambien debe cambiarlo por el que se tenga registrado.

Despues se ejecutan los siguientes comandos:

$ cree e ingrese en el ambiente virtual (revise el txt comandos ambiente virtual)
$ cd ../path/to/the/file   (path al directorio Electrica_backend del proyecto)
$ 
$ python manage.py runserver
$
```
Pasos para ejecutar el Frontend:
```
$ cd ../path/to/the/file  (path al directorio Electrica_frontend del proyecto)
$ npm install
$ npm run dev
```
