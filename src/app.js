var api = require('./neo4jApi');

$(function () {
      renderGraph();
      buscar();

      $("#buscar").submit(e => {
        e.preventDefault();
        buscar();
      });
});

/**
 * Funcion que muestra en el HTML el Lenguaje con sus propiedades
 * @param titulo
 */
function mostrarLenguaje(titulo) {
    api.getParadigmas(titulo).then(par => {
        if (par) {
            $("#titulo").text(titulo);
            var $lista = $("#paradigma").empty();
            par.paradigmas.forEach(p => {
                $lista.append($("<li>" + p.Nombre + "</li>"));
            });
        }
    }, "json");

    api.getInfluencias(titulo).then(inf => {
        if (inf) {
            $("#titulo").text(titulo);
            var $lista = $("#influido").empty();
            inf.influencias.forEach(i => {
                $lista.append($("<li>" + i.Nombre + "</li>"));
            });
        }
    }, "json");

    api.getCreaciones(titulo).then(lenguaje => {
        if (lenguaje) {
            $("#titulo").text(titulo);
            var $lista = $("#crea").empty();
            lenguaje.creaciones.forEach(c => {
                $lista.append($("<li>" + c.Nombre + "</li>"));
            });
        }
    }, "json");
}

/**
 * Funcion que busca en la base de datos y los muestra en la
 * tabla del HTML
 */
function buscar() {
      var textoIntroducido = $("#buscar").find("input[name=search]").val();
      api.buscaLenguajes(textoIntroducido).then(lenguajes => {
          var t = $("table#resultados tbody").empty();

          if (lenguajes) {
            lenguajes.forEach(l => {
                $("<tr><td class='lenguaje'>" + l.Nombre + "</td><td>" + l.fecha_creacion + "</td><td>" + l.SO + "</td></tr>").appendTo(t)
                .click(function() {
                  mostrarLenguaje($(this).find("td.lenguaje").text());
                })
            });

            var first = lenguajes[0];
            if (first) {
                mostrarLenguaje(first.Nombre);
            }
          }
        });
}

function renderGraph() {
      var width = 800, height = 800;
      var force = d3.layout.force()
        .charge(-200).linkDistance(30).size([width, height]);

      var svg = d3.select("#graph").append("svg")
        .attr("width", "100%").attr("height", "100%")
        .attr("pointer-events", "all");

      api.getGraph().then(graph => {
          force.nodes(graph.nodes).links(graph.links).start();

          var link = svg.selectAll(".link")
            .data(graph.links).enter()
            .append("line").attr("class", "link");

          var node = svg.selectAll(".node")
            .data(graph.nodes).enter()
            .append("circle")
            .attr("class", d => {
              return "node " + d.label
            })
            .attr("r", 10)
            .call(force.drag);

          // html title attribute
          node.append("title")
            .text(d => {
              return d.title;
            });

          // force feed algo ticks
          force.on("tick", () => {
            link.attr("x1", d => {
              return d.source.x;
            }).attr("y1", d => {
              return d.source.y;
            }).attr("x2", d => {
              return d.target.x;
            }).attr("y2", d => {
              return d.target.y;
            });

            node.attr("cx", d => {
              return d.x;
            }).attr("cy", d => {
              return d.y;
            });
          });
        });
}
