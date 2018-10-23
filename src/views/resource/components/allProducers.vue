<style lang="less">
@import "../../../styles/common.less";
</style>

<template>
    <div class="allProducers">
         <Table border :columns="columns" :data="producers"></Table>
    </div>
</template>

<script>
import Util from "@/libs/util";
export default {
  name: "all-producers",
  data() {
    return {
      columns: [
        {
          title: "目的地名称",
          key: "DestinationName"
        },
        {
          title: "会话标识",
          key: "SessionId"
        },
        {
          title: "生产者标识",
          key: "ProducerId",
          render:(h,params) => {
          return h('p',{
          'class':['over-hidden','over-hidden-hover']
           },params.row.ProducerId)
           }          
        },
        {
          title: "等待发送最大消息量",
          key: "ProducerWindowSize"
        },
        {
          title: "异步分发",
          key: "DispatchAsync",
          render:(h,params) => {
          return h('p',{},Util.formats(params.row.DispatchAsync).formatBoolean().toString())
           }
        },
        {
          title: "请求阻塞",
          key: "ProducerBlocked",
          render:(h,params) => {
          return h('p',{},Util.formats(params.row.DispatchAsync).formatBoolean().toString())
           }
        },  
        {
          title: "阻塞总时间",
          key: "TotalTimeBlocked"
        },
        {
          title: "发送消息量",
          key: "SentCount"
        }
      ],
      producers: []
    };
  },
  methods: {
    init() {
      let type = this.$route.params.type;  
      let name = this.$route.params.queue_name;
      let self = this;
      Util.mbeanName(self)
        .then(mbeanName => {
          return Util.ajax.post("", {
            type: "read",
            mbean:
              mbeanName +
              ",destinationType="+type+",destinationName=" +
              name +
              ",endpoint=Producer,clientId=*,producerId=*"
          });
        })
        .then(res => {
          if (res.data.status == 200) {
            if (res.data.value) {
              if (res.data.value instanceof Array) {
                let arrs = res.data.value.map(c => {
                  return Util.ajax.post("", {
                    type: "read",
                    mbean: c.objectName
                  });
                });
                return Promise.all(arrs);
              } else {
                let arrs = Object.keys(res.data.value).map(c => {
                  return Util.ajax.post("", {
                    type: "read",
                    mbean: c
                  });
                });
                return Promise.all(arrs);
              }
            }
          }else{
              this.producers = [];
          }
        })
        .then(alls => {
          if (alls) {
            this.producers = alls.map(one => one.data.value);
          }
        });
    }
  },
  created() {},
  mounted() {
      this.init();
  },
  activated(){
      this.init();
  }
};
</script>
