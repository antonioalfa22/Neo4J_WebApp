# Neo4j Lenguajes de programaci�n - Aplicaci�n de ejemplo

![imagen de la aplicacion](./img/demo.png)

## Instrucciones

### Instalar dependencias

```bash
# Se necesita tener instalado NodeJS
$ npm install
```

### Ejecutar localmente

* Ejecutar Neo4J ([Descargar e Instalar](http://neo4j.com/download)) localmente (/bin neo4J console)
* y abrir el Neo4J Browser [Neo4j Browser](http://localhost:7474). 
* Ir a la carpeta del proyecto y ejecutar en l�nea de comandos:

```bash
# Ejecutar en modo desarrollo, los cambios se actualizan autom�ticamente
$ npm run dev

# Para construir la aplicaci�n en la carpeta build
$ npm run build
```

Cuando se est� ejecutando en modo dev, ir a la direcci�n [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/) para ver la app.

Despu�s de ejecutar el comando `npm run build`,  abrir el archivo "build/index.html" en el navegador.
