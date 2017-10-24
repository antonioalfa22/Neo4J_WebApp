var _ = require('lodash');

function Creaciones(nombreLenguaje, creaciones) {
  _.extend(this, {
    nombreLenguaje: nombreLenguaje,
    creaciones: creaciones.map(function (c) {
      return {
        Nombre: c
      }
    })
  });
}

module.exports = Creaciones;
