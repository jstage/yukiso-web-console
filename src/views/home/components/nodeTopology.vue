<style lang="less">
.links line {
  stroke: #999;
  stroke: #14e047;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}
.nodes circle:hover {
  cursor: pointer;
}
.overlay {
  fill: none;
  pointer-events: all;
}
.active {
  fill: orange;
}
</style>

<template>
    <div ref="node">
      <svg :id="node" width="100%" :height="heightString"></svg>
    </div>
</template>

<script>
import * as d3 from "d3";
import Util from "@/libs/util";
import axios from "axios";
import _ from "lodash";
export default {
  name: "nodeTopology",
  mounted() {
    this.init();
  },
  data() {
    return {
      broker: "",
      heightString: this.height + "px"
    };
  },
  props: {
    node: "",
    height: {
      type: Number,
      default: 300
    }
  },
  methods: {
    recursionNodes(node) {
      let nodes = [];
      let links = [];
      let localBrokerId = "";
      let source = node.RemoteAddress.split("//")[1];
      let request = axios.create({
        baseURL: "http://" + source + "/console/jolokia",
        timeout: 30000
      });
      request.interceptors.request.use(
        function(config) {
          var token = localStorage.JWT_TOKEN;
          if (token) {
            config.headers.Authorization = "Bearer " + token;
          }
          return config;
        },
        function(error) {
          return Promise.reject(error);
        }
      );
      return Util.getMbeanNameAny(this,request).then(mbean => {
        if (mbean) {
          let beanName = Object.keys(mbean)[0];
          localBrokerId = mbean[beanName];
          request
            .post("", {
              mbean:
                mbean +
                ",connector=networkConnectors,networkBridge=*,networkConnectorName=*",
              type: "read"
            })
            .then(res => {
              if (res) {
                nodes = Object.values(res.data.value).map((e, i) => {
                  nodes.push({
                    id: e.RemoteBrokerId,
                    name: e.RemoteBrokerName,
                    group: i + 2
                  });
                  links.push({
                    source: localBrokerId,
                    target: e.RemoteBrokerId,
                    value: 9
                  });
                  return e;
                });
                return Promise.all(recursionNodes(e));
              } else {
                return new Promise({
                  nodes,
                  links
                });
              }
            });
        }
      });
    },
    init: function() {
      this.$nextTick(() => {
        let self = this;
        Util.mbeanName(self)
          .then(broker => {
            this.broker = broker;
            let arr = [];
            arr.push(
              Util.ajax.post("", {
                mbean:
                  broker +
                  ",connector=networkConnectors,networkBridge=*,networkConnectorName=*",
                type: "read"
              })
            );
            arr.push(Util.getBrokerName(self));
            return Promise.all(arr);
          })
          .then(res => {
            let localBrokerId = "";
            let localName = "";
            let nodes = [];
            let links = [];
            if (res && res.length === 2) {
              res.forEach(ele => {
                if (!ele.request) {
                  localBrokerId = ele.BrokerId;
                  localName = ele.BrokerName;
                }
              });
              res.forEach(ele => {
                if (ele.status && ele.status == 200 && ele.data.status === 200) {
                  nodes.push({
                    id: localBrokerId,
                    name: localName,
                    group: 1
                  });
                  Object.values(ele.data.value).forEach((e, i) => {
                      nodes.push({
                        id: e.RemoteBrokerId,
                        name: e.RemoteBrokerName,
                        group: i + 2
                      });
                      links.push({
                        source: localBrokerId,
                        target: e.RemoteBrokerId,
                        value: 9
                      });
                  });
              }});
              return  nodes.length && links.length ? {
                nodes,
                links
              } : null;
          }})
          .then(bridges => {
            //  单节点情况
            if (!bridges) {
              //org.apache.activemq:type=Broker,brokerName=yukiso
              this.broker
                .split(":")[1]
                .split(",")
                .forEach(e => {
                  if (e.indexOf("brokerName") != -1) {
                    bridges = {};
                    bridges.nodes = [];
                    bridges.links = [];
                    bridges.nodes.push({
                      id: e.split("=")[1],
                      name: e.split("=")[1],
                      group: 1
                    });
                  }
                });
            }
            let self = this;
            var svg = d3.select("#" + this.node),
              width = this.$refs.node.clientWidth,
              height = this.height;
            var color = d3.scaleOrdinal(d3.schemeCategory20);
            var active = d3.select(null);
            var simulation = d3
              .forceSimulation()
              .force(
                "link",
                d3.forceLink().id(function(d) {
                  return d.id;
                })
              )
              .force("charge", d3.forceManyBody().strength(-5000))
              .force("center", d3.forceCenter(width / 2, height / 2));

            function dragstarted(d) {
              if (!d3.event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            }
            function dragged(d) {
              d.fx = d3.event.x;
              d.fy = d3.event.y;
            }
            function dragended(d) {
              if (!d3.event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            }
            var zoom = d3
              .zoom()
              .scaleExtent([1 / 2, 4])
              .on("zoom", zoomed);
            var link = svg
              .append("g")
              .attr("class", "links")
              .selectAll("line")
              .data(bridges.links)
              .enter()
              .append("line")
              .attr("stroke-width", function(d) {
                return Math.sqrt(d.value);
              });
            var node = svg
              .append("g")
              .attr("class", "nodes")
              .selectAll("circle")
              .data(bridges.nodes)
              .enter()
              .append("circle")
              .attr("r", 30)
              .attr("fill", function(d) {
                return color(d.group);
              })
              .call(
                d3
                  .drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended)
              )
              .on("click", function(event) {
                if (active.node() === this) return reset();
                active.classed("active", false);
                active = d3.select(this).classed("active", true);
                svg
                  .transition()
                  .duration(750)
                  .call(
                    zoom.transform,
                    d3.zoomIdentity
                      .translate(
                        -event.x * 4 + width / 2,
                        -event.y * 4 + height / 2
                      )
                      .scale(4)
                  );
              });
            function reset() {
              active.classed("active", false);
              active = d3.select(null);
              svg
                .transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4
            }
            var texts = svg
              .append("g")
              .selectAll("text")
              .data(bridges.nodes)
              .enter()
              .append("text")
              .attr("text-anchor", "middle")
              .text(function(d) {
                return d.name;
              });
            svg.call(zoom).on("dblclick.zoom", null);
            function zoomed() {
              var t = d3.zoomTransform(svg.node());
              node.attr(
                "transform",
                "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")"
              );
              link.attr(
                "transform",
                "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")"
              );
              texts.attr(
                "transform",
                "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")"
              );
            }
            node.append("title").text(function(d) {
              return d.id;
            });
            simulation
              .nodes(bridges.nodes)
              .on("tick", ticked)
              .force("link")
              .links(bridges.links);
            function ticked() {
              link
                .attr("x1", function(d) {
                  return d.source.x;
                })
                .attr("y1", function(d) {
                  return d.source.y;
                })
                .attr("x2", function(d) {
                  return d.target.x;
                })
                .attr("y2", function(d) {
                  return d.target.y;
                });

              node
                .attr("cx", function(d) {
                  return d.x;
                })
                .attr("cy", function(d) {
                  return d.y;
                });

              texts
                .attr("x", function(d) {
                  return d.x;
                })
                .attr("y", function(d) {
                  return d.y;
                });
            }
          });
      });
    }
  }
};
</script>
