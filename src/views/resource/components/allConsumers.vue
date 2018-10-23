<style lang="less">
@import "../../../styles/common.less";
</style>

<template>
    <div class="allConsumers">
         <Table border :columns="columns" :data="consumers"></Table>
    </div>
</template>

<script>
import Util from "@/libs/util";
export default {
  name: "all-consumers",
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
          title: "消息选择器",
          key: "Selector"
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
          title: "客户端接收次数",
          key: "DispatchedCounter"
        },
        {
          title: "未确认的消息数",
          key: "DispatchedQueueSize"
        },
        {
          title: "最大未确认消息数&&最大丢弃消息数",
          render: (h, params) => {
            return h("div", {}, [
              h("p", {}, params.row.PrefetchSize),
              h("p", {}, params.row.MaximumPendingMessageLimit)
            ]);
          }
        },
        {
          title: "独占消费者&&回溯消费者",
          render: (h, params) => {
            return h("div", {}, [
              h("p", {}, params.row.Exclusive),
              h("p", {}, params.row.Retroactive)
            ]);
          }
        }
      ],
      consumers: []
    };
  },
  methods: {
    init() {
      let name = this.$route.params.queue_name;
      let self = this;
      Util.mbeanName(self)
        .then(mbeanName => {
          return Util.ajax.post("", {
            type: "read",
            mbean: mbeanName + ",destinationType=Queue,destinationName=" + name,
            attribute: "Subscriptions"
          });
        })
        .then(res => {
          if (res.data.status == 200) {
            if (res.data.value && res.data.value.length > 0) {
              let arrs = res.data.value.map(c => {
                return Util.ajax.post("", {
                  type: "read",
                  mbean: c.objectName
                });
              });
              return Promise.all(arrs);
            }
          }
        })
        .then(alls => {
          if (alls) {
            this.consumers = alls.map(one => one.data.value);
          }
        });
    }
  },
  created() {},
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  }
};
</script>
