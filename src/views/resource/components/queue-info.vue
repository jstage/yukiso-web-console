
<template>
    <div>
        <Table border :columns="columns" :data="order_data"></Table>
        <Page :total="totalLength" :current="1" show-total @on-change="changePage"></Page>
    </div>
</template>

<script>
import Util from "@/libs/util";
export default {
  name: "queue-info",
  data() {
    return {
      order_data: [],
      totalLength: 0,
      pageSize: 10,
      columns: [
        {
          title: "消息ID",
          key: "JMSMessageID",
          render: (h, params) => {
            return h(
              "a",
              {
                class: ["over-hidden", "over-hidden-hover"],
                on: {
                  click: () => {
                      let self = this;
                    Util.mbeanName(self)
                      .then(mbeanName => {
                        return Util.ajax.post("", {
                          type: "exec",
                          mbean:
                            mbeanName +
                            ",destinationType=Queue,destinationName=" +
                            this.$route.query.queue_name,
                          operation: "getMessage(java.lang.String)",
                          arguments: [params.row.JMSMessageID]
                        });
                      })
                      .then(res => {
                        this.$Modal.info({
                          title: "消息内容",
                          content: res.data.value.Text
                        });
                      });
                  }
                }
              },
              params.row.JMSMessageID
            );
          }
        },
        {
          title: "持久化",
          key: "JMSDeliveryMode",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.JMSDeliveryMode)
                .formatCompare("PERSISTENT")
                .toString()
            );
          }
        },
        {
          title: "优先级",
          key: "JMSPriority"
        },
        {
          title: "消息是否重发",
          key: "JMSRedelivered",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.JMSRedelivered)
                .formatBoolean()
                .toString()
            );
          }
        },
        {
          title: "消息回复地",
          key: "JMSReplyTo",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.JMSReplyTo)
                .formatEmpty()
                .toString()
            );
          }
        },
        {
          title: "消息创建时间",
          key: "JMSTimestamp",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.JMSTimestamp)
                .formatTime()
                .toString()
            );
          }
        },
        {
          title: "操作",
          key: "JMSMessageID",
          render: (h, params) => {
            return h("div", [
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    placement: "left-end",
                    title: "您确认删除这条消息吗？"
                  },
                  on: {
                    "on-ok": () => {
                      this.delete(params.row.JMSMessageID);
                    },
                    "on-cancle": () => {}
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {}
                      }
                    },
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    init(first, count) {
        let self = this;
      let queueName = this.$route.query.queue_name;
      Util.mbeanName(self)
        .then(mbeanName => {
          return Util.ajax.post("", {
            type: "exec",
            mbean:
              mbeanName + ",destinationType=Queue,destinationName=" + queueName,
            operation: "browse()"
          });
        })
        .then(res => {
          let arr = res.data.value;
          let length = res.data.value.length;
          this.totalLength = length;
          if (first) {
            if (length > this.pageSize) {
              this.order_data = arr.slice(0, this.pageSize);
            } else {
              this.order_data = arr;
            }
          } else {
            if (length > this.pageSize * (count - 1)) {
              if (length < this.pageSize * count) {
                this.order_data = arr.slice(
                  this.pageSize * (count - 1),
                  length
                );
              } else {
                this.order_data = arr.slice(
                  this.pageSize * (count - 1),
                  this.pageSize * count
                );
              }
            }
          }
        });
    },
    delete(messageId) {
        let self = this;
      let queueName = this.$route.query.queue_name;
      Util.mbeanName(self)
        .then(mbeanName => {
          return Util.ajax.post("", {
            type: "exec",
            mbean:
              mbeanName + ",destinationType=Queue,destinationName=" + queueName,
            operation: "removeMessage",
            arguments: [messageId]
          });
        })
        .then(res => {
          let flag = res.data.value;
          if (flag) {
            this.$Notice.success({
              title: "操作成功!",
              duration: 1,
              onClose: () => {
                this.init(true);
              }
            });
          } else {
            this.$Notice.error({
              title: "该消息已被发送，不可删除!",
              duration: 1,
              onClose: () => {
                this.init(true);
              }
            });
          }
        });
    },
    changePage(count) {
      this.init(false, count);
    }
  },
  mounted() {
    this.init(true);
  },
  activated() {
    this.init(true);
  }
};
</script>
