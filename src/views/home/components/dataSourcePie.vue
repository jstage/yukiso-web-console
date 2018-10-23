<template>
    <div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts';
import Util from "@/libs/util";
export default {
    name: 'dataSourcePie',
    data () {
        return {
            //
        };
    },
    mounted () {
        this.$nextTick(() => {
            var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    data: ['ios', 'android', 'pc', 'web', 'others']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '66%',
                        center: ['50%', '60%'],
                        data: [
                            {value: 2103456, name: 'ios', itemStyle: {normal: {color: '#9bd598'}}},
                            {value: 1305923, name: 'android', itemStyle: {normal: {color: '#ffd58f'}}},
                            {value: 543250, name: 'pc', itemStyle: {normal: {color: '#abd5f2'}}},
                            {value: 798403, name: 'web', itemStyle: {normal: {color: '#ab8df2'}}},
                            {value: 302340, name: 'others', itemStyle: {normal: {color: '#e14f60'}}}
                        ],
                        itemStyle: {
                             // itemStyle的emphasis是鼠标 hover 时候的高亮样式。
                            emphasis: {
                                // 阴影的大小
                                shadowBlur: 10,
                                // 阴影水平方向上的偏移
                                shadowOffsetX: 0,
                                // 阴影颜色
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            dataSourcePie.setOption(option);
            window.addEventListener('resize', function () {
                dataSourcePie.resize();
            });
        });
    }
};
</script>
