var _ = require('lodash');

function Influencias(nombreLenguaje, influencias) {
  _.extend(this, {
      nombreLenguaje: nombreLenguaje,
      influencias: influencias.map(function (c) {
      return {
        Nombre: c
      }
    })
  });
}

module.exports = Influencias;
