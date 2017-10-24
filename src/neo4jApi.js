require('file?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');
var Lenguaje = require('./models/Lenguaje');
var Paradigmas = require('./models/Paradigmas');
var Creaciones = require('./models/Creaciones');
var Influencias = require('./models/Influencias');
var _ = require('lodash');

var neo4j = window.neo4j.v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"));

/**
 * Metodo que busca lenguajes en la base de datos
 * dado un nombre
 * @param nombre
 */
function buscaLenguajes(nombre) {
      var session = driver.session();
      return session.run(
          'MATCH (n:Lenguaje_programacion) \
          WHERE n.Nombre =~ {t} \
          RETURN n',
          {t: '(?i).*' + nombre + '.*'}
        )
        .then(result => {
          session.close();
          return result.records.map(record => {
            return new Lenguaje(record.get('n'));
          });
        })
        .catch(error => {
          session.close();
          throw error;
        });
}

/**
 * Funcion que devueve una lista de paradigmas que
 * usa el lenguaje
 * @param nombre
 */
function getParadigmas(nombre) {

    var session = driver.session();
    return session
        .run(
        'MATCH (n:Lenguaje_programacion {Nombre:{a}}) \
      OPTIONAL MATCH (n)-[r:USA_PARADIGMA]->(p:Paradigma) \
      RETURN n.Nombre AS nombre, \
      collect(p.Nombre) AS paradigmas \
      LIMIT 1', { a: ""+nombre }).then(result => {
            session.close();

            if (_.isEmpty(result.records))
                return null;

            var record = result.records[0];
            return new Paradigmas(record.get('nombre'), record.get('paradigmas'));
        })
        .catch(error => {
            session.close();
            throw error;
        });
}

/**
 * Funcion que devueve una lista de influencias
 * @param nombre
 */
function getInfluencias(nombre) {
    var session = driver.session();
    return session
        .run(
        'MATCH (n:Lenguaje_programacion {Nombre:{a}}) \
      OPTIONAL MATCH (n)-[r:INFLUIDO_POR]->(p:Lenguaje_programacion) \
      RETURN n.Nombre AS nombre, \
      collect(p.Nombre) AS influencias \
      LIMIT 1', { a: ""+nombre }).then(result => {
            session.close();

            if (_.isEmpty(result.records))
                return null;

            var record = result.records[0];
            return new Influencias(record.get('nombre'), record.get('influencias'));
        })
        .catch(error => {
            session.close();
            throw error;
        });
}

/**
 * Funcion que devueve una lista de cosas
 * creadas con el lenguaje
 * @param nombre
 */
function getCreaciones(nombre) {
    var session = driver.session();
    return session
        .run(
        'MATCH (n:Lenguaje_programacion {Nombre:{a}}) \
      OPTIONAL MATCH (n)<-[r:HECHO_EN]-(p) \
      RETURN n.Nombre AS nombre, \
      collect(p.Nombre) AS creaciones \
      LIMIT 1', { a: ""+nombre }).then(result => {
            session.close();

            if (_.isEmpty(result.records))
                return null;

            var record = result.records[0];
            return new Creaciones(record.get('nombre'), record.get('creaciones'));
        })
        .catch(error => {
            session.close();
            throw error;
        });
}

function getGraph() {
      var session = driver.session();
      return session.run(
        'MATCH (m:Lenguaje_programacion)-[r:INFLUIDO_POR]->(p:Lenguaje_programacion) \
        RETURN m.Nombre AS lenguaje, collect(p.Nombre) AS influencias\
        LIMIT {limit}', {limit: 100})
        .then(results => {
          session.close();
          var nodes = [], rels = [], i = 0;
          results.records.forEach(res => {
            nodes.push({title: res.get('lenguaje'), label: 'lenguaje'});
            var target = i;
            i++;
            res.get('influencias').forEach(name => {
                var actor = { title: name, label: 'influencias' };
                var source = _.findIndex(nodes, actor);
                if (source == -1) {
                    nodes.push(actor);
                    source = i;
                    i++;
                }
                rels.push({ source, target })
            })
          });

          return { nodes, links: rels };
        });
}

exports.buscaLenguajes = buscaLenguajes;
exports.getParadigmas = getParadigmas;
exports.getCreaciones = getCreaciones;
exports.getInfluencias = getInfluencias;
exports.getGraph = getGraph;

