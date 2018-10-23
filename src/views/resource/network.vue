<style lang="less">

</style>
<template>
    <div class="network">
        <Card>
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                网络桥接
            </p>
            <a class="hover-refresh" href="#" slot="extra" @click.prevent="refresh()">
                <Icon size="18" type="ios-loop-strong"></Icon>
                刷新
            </a>
            <Table :columns="columns" :data="bridges"></Table>
        </Card>
    </div>
</template>
<script>
import Util from '@/libs/util'
export default {
  name: "network",
  data() {
    return {
      columns: [  
        {
          title: "远端Broker",
          key: "RemoteBrokerName"
        },
        {
          title: "远端地址",
          key: "RemoteAddress"
        },
        {
          title: "双向桥接",
          key: "CreatedByDuplex",
          render:(h,params) => {
          return h('p',{},Util.formats(params.row.CreatedByDuplex).formatBoolean().toString())
          }
        },
        {
          title: "入队消息数",
          key: "EnqueueCounter"
        },
        {
          title: "出队消息数",
          key: "DequeueCounter"
        }
      ],
      bridges: []
    };
  },
  methods: {
    refresh(){
      this.init();
    },
    init() {
      let self = this;
        Util.mbeanName(self).then(broker => {
            return Util.ajax.post('',{
                'mbean':broker + ',connector=networkConnectors,networkBridge=*,networkConnectorName=*',
                'type' : "read"
            })
        }).then(res => {
            let result = res.data;
            if(result.status == 200){
                if(Object.values(result.value).length >0){
                    this.bridges = Object.values(result.value);
                }
            }
        })
    }
  },
  created() {
    this.init();
  }
};
</script>
