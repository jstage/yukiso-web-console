<style>
.arc text {
  font: 10px sans-serif;
  text-anchor: middle;
}

.arc path {
  stroke: #fff;
}
</style>

<template>
    <svg style="width:100%;height:100%;"  ref="chartRef" id="data_source_con"></svg>
</template>

<script>
import echarts from "echarts";
import * as d3 from "d3";
import Util from "@/libs/util";
export default {
  name: "dataSourcePie",
  data() {
    return {
      threadObj: Object
    };
  },
  props:{
    data:Array
  },
  mounted() {
    // this.pieFromD3();
    // this.getThread();
    this.simplePieChart();
  },
  methods: {
    simplePieChart(){
        const containerWidth = this.$refs.chartRef.parentElement.offsetWidth;
        const margin = { top: 80, right: 60, bottom: 80, left: 60 };
        const width = containerWidth - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
        let chart = d3.select(this.$refs.chartRef).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);// 设置总宽高

        const radius = Math.min(width, height) / 2;

        let g = chart.append("g").attr("transform", "translate(" + (width / 2 + margin.left) + "," + (margin.top + radius) + ")"); // 设最外包层在总图上的相对位置

        let colors = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        let arc = d3.arc() // 定义单个圆弧
            .innerRadius(radius - 70)
            .padAngle(0.03);

        let startPointArc = d3.arc() // 定义单个圆弧里面的线条开始点所在的弧
            .outerRadius(radius - 10)
            .innerRadius(radius - 10);

        let percentLabelArc = d3.arc() // 定义单个圆弧里面的percent文字
            .outerRadius(radius - 60)
            .innerRadius(radius - 60);

        let populationLabelArc = d3.arc() // 定义单个圆弧里面的population文字
            .outerRadius(radius + 40)
            .innerRadius(radius + 40);

        let pie = d3.pie() // 定义饼图
            .sort(null)
            .value(function (d) { return d.population; });

        const data = this.data;
        const sumData = d3.sum(data, function (d) { return d.population; });
        colors.domain(d3.map(data, function (d) { return d.age; }).keys()); // 定义颜色值域

        g.selectAll(".arc") // 画环图
            .data(pie(data))
            .enter().append("path")    
            .attr("cursor", "pointer")
            .attr("class", "arc")
            .attr('stroke', function (d) { return colors(d.data.age); })
            .style("fill", function (d) { return colors(d.data.age); })
            .each(function(d) { // 储存当前起始与终点的角度、并设为相等
                let tem = {...d, endAngle: d.startAngle};
                d.outerRadius = radius - 10;
                this._currentData = tem; 
            })
            .on("mouseover", arcTween(radius + 20, 0))
    　　　　.on("mouseout", arcTween(radius - 10, 150))
            .transition()
            .duration(100)
            .delay(function (d, i) { return i * 100; })
            .attrTween("d", function(next) { // 动态设置d属性、生成动画
              var i = d3.interpolate(this._currentData, next);
              this._currentData = i(0);　// 重设当前角度
              return function(t) {
                return arc(i(t));
              };
            });


        const arcs = pie(data); // 构造圆弧

        let linkLine = g.append("g"); // 创建每条连接线
        let links = [];
        arcs.forEach(function (d) { // 输出age文字
            const startPoint = startPointArc.centroid(d);
            const endPoint = populationLabelArc.centroid(d);
            links.push({
                source: [startPoint[0], startPoint[1]],
                target: [endPoint[0], endPoint[1]]
            });
        });

        linkLine.selectAll()
        .data(links)
        .enter()
        .append("path")
                .attr("class", "link-line")
                .style("stroke", "#999")
                .style("stroke-width", 1)
                .attr('fill', 'none')
                .attr("d", d3.linkHorizontal().source(function(d){ return d.source; }).target(function(d){ return d.target; }));        
 
        let label = g.append("g");       

        arcs.forEach(function (d) { // 输出percent文字
            const c = percentLabelArc.centroid(d);
            label.append("text")
                 .attr("class", "age-text")
                 .attr('fill', '#cddc39')
                 .attr('font-weight', '700')
                 .attr('font-size', '14px')
                 .attr('text-anchor', 'middle')
                 .attr('x', c[0])
                 .attr('y', c[1])
                 .text((d.data.population * 100 / sumData).toFixed(1) + '%');
        });

        arcs.forEach(function (d) { // 输出population文字
            var c = populationLabelArc.centroid(d);
            label.append("text")
                 .attr("class", "age-text")
                 .attr('fill', '#000')
                 .attr('font-size', '12px')
                 .attr('text-anchor', function(d){
                    return c[0] >= 0 ? 'start' : 'end'; 
                 })
                 .attr('x', c[0])
                 .attr('y', c[1])
                 .text(d.data.age + '岁 : ' + (d.data.population / 10000).toFixed(2) + '万人');
        });

        chart.append('g')// 输出标题
            .attr('class', 'arc--title')
            .append('text')
            .attr('fill', '#fff')
            .attr('font-size', '14px')
            .attr('font-weight', '700')
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (margin.top + radius) + ")")
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', 0)
            .text('XX市人口年龄结构');     

        function arcTween(outerRadius, delay) { // 设置缓动函数
          return function() {
            d3.select(this).transition().delay(delay).attrTween("d", function(d) {
              var i = d3.interpolate(d.outerRadius, outerRadius);
              return function(t) { d.outerRadius = i(t); return arc(d); };
            });
          };
        }
    },
    pieFromD3(){
        var data = [10, 20, 100];
        var width = 300,
            height = 200,
            radius = Math.min(width, height) / 2;
        var color = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888"]);
        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d; });

        var svg = d3.select("#data_source_con").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

          var g = svg.selectAll(".arc")
              .data(pie(data))
            .enter().append("g")
              .attr("class", "arc");

          g.append("path")
              .attr("d", arc)
              .style("fill", function(d) { return color(d.data); });

          g.append("text")
              .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .text(function(d) { return d.data; });
    },
    getThread() {
      let self = this;
      Util.getThreading(self).then(res => {
        this.threadObj = res;
      //  console.log(this.threadObj);
        this.getData();
      });
    },
    getData() {
      this.$nextTick(() => {
        var dataSourcePie = echarts.init(
          document.getElementById("data_source_con")
        );
        const option = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "right",
            data: ["线程数", "峰值", "守护线程数", "共开启线程数"]
          },
          series: [
            {
              name: "线程来源",
              type: "pie",
              radius: "66%",
              center: ["50%", "60%"],
              data: [
                {
                  value: this.threadObj.ThreadCount,
                  name: "线程数",
                  itemStyle: { normal: { color: "#aa52b3" } }
                },
                {
                  value: this.threadObj.PeakThreadCount,
                  name: "峰值",
                  itemStyle: { normal: { color: "#e14f60" } }
                },
                {
                  value: this.threadObj.DaemonThreadCount,
                  name: "守护线程数",
                  itemStyle: { normal: { color: "#5cb85c" } }
                },
                {
                  value: this.threadObj.TotalStartedThreadCount,
                  name: "共开启线程数",
                  itemStyle: { normal: { color: "#abd5f2" } }
                }
                // {value: 302340, name: 'others', itemStyle: {normal: {color: '#e14f60'}}}
              ],
              itemStyle: {
                // itemStyle的emphasis是鼠标 hover 时候的高亮样式。
                emphasis: {
                  // 阴影的大小
                  shadowBlur: 10,
                  // 阴影水平方向上的偏移
                  shadowOffsetX: 0,
                  // 阴影颜色
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };

        dataSourcePie.setOption(option);
        //当浏览器窗口被调整大小时触发。
        window.addEventListener("resize", function() {
          dataSourcePie.resize();
        });
        this.refreshData();
      });
    },
    refreshData(){
        window.setInterval(this.getThread(),3000);
     }
    
  }
};
</script>