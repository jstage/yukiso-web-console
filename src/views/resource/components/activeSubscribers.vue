<template>
    <Table stripe :columns="columns1" :data="data1"></Table>
</template>
<script>
import Util from "@/libs/util";
export default {
  data() {
    return {
      columns1: [
        {
          title: "订阅者名称",
          key: "SubscriptionName"
        },
        {
          title: "客户端标识",
          key: "ClientId",
          render:(h,params) => {
          return h('p',{
          'class':['over-hidden','over-hidden-hover']
           },params.row.ClientId)
           }    
        },
        {
          title: "连接标识",
          key: "ConnectionId",
          render:(h,params) => {
          return h('p',{
          'class':['over-hidden','over-hidden-hover']
           },params.row.ConnectionId)
           }    
        },
        {
          title: "订阅者标识",
          key: "SubscriptionId"
        },
        {
          title: "消息选择器",
          key: "Selector"
        },
        {
          title: "正常运行",
          key: "Active",
          render:(h,params) => {
          return h('p',{},Util.formats(params.row.Active).formatBoolean().toString())
          }
        },
        {
          title: "网络连接",
          key: "Network",
          render:(h,params) => {
          return h('p',{},Util.formats(params.row.Network).formatBoolean().toString())
          }
        },
        {
          title: "未接收消息数",
          key: "PendingQueueSize"
        },
        {
          title: "等待确认消息数",
          key: "MessageCountAwaitingAcknowledge"
        },
        {
          title: "入队消息数",
          key: "EnqueueCounter"
        },
        {
          title: "出队消息数",
          key: "DequeueCounter"
        },
        {
          title: "最大未确认消息数",
          key: "PrefetchSize"
        }
      ],
      data1: []
    };
  },
  methods: {
    init() {
      let topicName = this.$route.query.topic_name;
      let self = this;
      Util.mbeanName(self)
        .then(mbeanName => {
          return Util.ajax.post("", {
            type: "read",
            mbean:
              mbeanName +
              ",destinationType=Topic,destinationName=" +
              topicName +
              ",endpoint=Consumer,clientId=*,consumerId=*"
          });
        })
        .then(res => {
          let arr = res.data.value;
          if (null != arr) {
            this.data1 = Object.keys(arr).map(ele1 => {
              return arr[ele1];
            });
          } else {
            this.data1 = [];
          }
        });
    }
  },
  created() {
    this.init();
  }
};
</script>
