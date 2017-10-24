var _ = require('lodash');

function Paradigmas(nombreLenguaje, paradigmas) {
  _.extend(this, {
    nombreLenguaje: nombreLenguaje,
    paradigmas: paradigmas.map(function (c) {
      return {
          Nombre: c
      }
    })
  });
}

module.exports = Paradigmas;
