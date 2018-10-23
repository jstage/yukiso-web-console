<style lang="less">
@import "./queue.less";
</style>

<template>
    <div class="queue">
        <Form ref="searchForm" :model="searchForm" :rules="ruleValidate" style="width: 350px">
            <FormItem
              prop="name">
              <Row>
                  <Col span="14">
                      <Input type="text" v-model="searchForm.name" placeholder="输入队列名称"></Input>
                  </Col>
                  <Col span="4" offset="1">
                      <Button type="primary" @click="handleAdd('searchForm')">新增</Button>
                  </Col>
                  <Col span="4" offset="1">
                      <Button type="info" @click="refresh()">刷新</Button>
                  </Col>
              </Row>
            </FormItem>
        </Form>
        <Table :loading="loading" :data="queues" :show-header="showHeader" :columns="tableColumns1" stripe border show-index="true"></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="totalLength" :current="1" @on-change="changePage" show-total></Page>
            </div>
        </div>
    </div>
</template>

<script>
import Util from "@/libs/util";
export default {
  name: "queue",
  brkerName: "",
  data() {
    return {
      ruleValidate: {
        name: [
          {
            required: true,
            message: "输入队列名称",
            trigger: "blur"
          }
        ]
      },
      searchForm: {
        name: ""
      },
      loading: true,
      tableSize: "small",
      showHeader: true,
      searchConName3: "",
      queues: [],
      select: "",
      pageSize: 10,
      totalLength: 0,
      tableColumns1: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          align: "center",
          title: "队列名称",
          key: "Name"
        },
        {
          align: "center",
          title: "等待队列",
          width: 120,
          key: "QueueSize"
        },
        {
          align: "center",
          title: "消费者",
          width: 120,
          key: "ConsumerCount"
        },
        {
          align: "center",
          title: "入队消息",
          width: 120,
          key: "EnqueueCount"
        },
        {
          align: "center",
          title: "出队消息",
          width: 120,
          key: "DequeueCount"
        },
        {
          align: "center",
          title: "查看",
          key: "Name",
          render: (h, params) => {
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: "查看所有消息"
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
                        click: () => {
                          this.showAllMessages(params.row);
                        }
                      }
                    },
                    "消息"
                  )
                ]
              ),
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: "查看所有消费者"
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "success",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          this.showAllconsumers(params.row);
                        }
                      }
                    },
                    "消费者"
                  )
                ]
              ),
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    content: "查看所有生产者"
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "info",
                        size: "small"
                      },
                      on: {
                        click: () => {
                          this.showAllproducers(params.row);
                        }
                      }
                    },
                    "生产者"
                  )
                ]
              )
            ]);
          }
        },
        {
          align: "center",
          title: "操作",
          key: "Name",
          render: (h, params) => {
            return h("div", [
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
                    click: () => {
                      this.sendTo(params.row.Name);
                    }
                  }
                },
                "发送"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    placement: "left-end",
                    title: "您确认清空此队列吗？"
                  },
                  on: {
                    "on-ok": () => {
                      this.purge(params.row.Name);
                    },
                    "on-cancle": () => {}
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "warning",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {}
                      }
                    },
                    "清空"
                  )
                ]
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    placement: "left-end",
                    title: "您确认删除此队列吗？"
                  },
                  on: {
                    "on-ok": () => {
                      this.remove(params.row.Name);
                    },
                    "on-cancle": () => {}
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
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
    refresh(){
      this.loading = true;
      this.init(true);
    },
    handleAdd(name) {
      let self = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          let queue = this.searchForm.name;
          Util.mbeanName(self)
            .then(res => {
              return Util.ajax.post("", {
                type: "exec",
                mbean: res,
                operation: "addQueue",
                arguments: [queue]
              });
            })
            .then(() => {
              this.$Notice.success({
                title: "操作成功!",
                duration: 1,
                onClose: () => {
                  this.init(true);
                  this.$refs[name].resetFields();
                }
              });
            });
        } else {
        }
      });
    },
    changePage(count) {
      this.loading = true;
      this.init(false, count);
    },
    sendTo(name) {
      this.$router.push({
        name: "send_message",
        query: { destination: name, type: "Queue" }
      });
    },
    purge(name) {
      let self = this;
      Util.mbeanName(self)
        .then(res => {
          return Util.ajax.post("", {
            type: "exec",
            mbean: res + ",destinationType=Queue,destinationName=" + name,
            operation: "purge"
          });
        })
        .then(() => {
          this.$Notice.success({
            title: "操作成功!",
            duration: 1,
            onClose: () => {
              this.init(true);
            }
          });
        });
    },
    remove(name) {
      let self = this;
      Util.mbeanName(self)
        .then(res => {
          return Util.ajax.post("", {
            type: "exec",
            mbean: res,
            operation: "removeQueue",
            arguments: [name]
          });
        })
        .then(() => {
          this.$Notice.success({
            title: "操作成功!",
            duration: 1,
            onClose: () => {
              this.init(true);
            }
          });
        });
    },
    showAllMessages(row) {
      this.$router.push({
        name: "queue_info",
        query: { queue_name: row.Name }
      });
    },
    showAllconsumers(row) {
      this.$router.push({
        name: "all-consumers",
        params: { queue_name: row.Name }
      });
    },
    showAllproducers(row) {
      this.$router.push({
        name: "all-producers",
        params: { type: "Queue", queue_name: row.Name }
      });
    },
    init(first, count) {
      let self = this;
      Util.getBrokerName(self)
        .then(broker => {
          let queues = broker.Queues;
          self.brokerName = broker.BrokerName;
          let promises = queues.map(queue => {
            return Util.ajax.post("", {
              type: "read",
              mbean: queue.objectName
            });
          });
          return Promise.all(promises);
        })
        .then(results => {
          let arr = results.map(res => {
            return res.data.value;
          });
          let length = arr.length;
          this.totalLength = length;
          if (first) {
            if (length > this.pageSize) {
              this.queues = arr.slice(0, this.pageSize);
            } else {
              this.queues = arr;
            }
            this.loading = false;
          } else {
            if (length > this.pageSize * (count - 1)) {
              if (length < this.pageSize * count) {
                this.queues = arr.slice(this.pageSize * (count - 1), length);
              } else {
                this.queues = arr.slice(
                  this.pageSize * (count - 1),
                  this.pageSize * count
                );
              }
              this.loading = false;
            }
          }
        });
    }
  },
  mounted() {},
  created() {
    this.init(true);
  }
};
</script>
