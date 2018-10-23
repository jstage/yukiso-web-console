<template>
    <div>
      <Form ref="searchForm" :model="searchForm" :rules="ruleValidate" style="width: 300px">
        <FormItem
            prop="name">
            <Row>
                <Col span="14">
                    <Input type="text" v-model="searchForm.name" placeholder="输入主题名称"></Input>
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
      <Table :loading="loading" :columns="columns7" :data="data6" border stripe show-index="true"></Table>
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
  data() {
    return {
      ruleValidate: {
        name: [
          {
            required: true,
            message: "输入主题名称",
            trigger: "blur"
          }
        ]
      },
      searchForm: {
        name: ""
      },
      showHeader: true,
      loading: true,
      totalLength: 0,
      pageSize: 10,
      columns7: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "主题名称",
          key: "Name",
          render:(h,params) => {
          return h('p',{
          'class':['over-hidden','over-hidden-hover']
          },params.row.Name)
          }
        },
        {
          title: "消费者",
          key: "ConsumerCount"
        },
        {
          title: "入队消息",
          key: "EnqueueCount"
        },
        {
          title: "出队消息",
          key: "DequeueCount"
        },
        {
          title: "操作",
          key: "action",
          width: 300,
          align: "left",
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
                      this.sendToMessage(params.row.Name);
                    }
                  }
                },
                "发送"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.activeSubscribers(params.row);
                    }
                  }
                },
                "订阅者"
              ),
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
                      this.showAllproducers(params.row);
                    }
                  }
                },
                "生产者"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    placement: "left-end",
                    title: "您确认删除此主题吗？"
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
      ],
      data6: []
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
                operation: "addTopic",
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
    remove(name) {
      let self = this;
      Util.mbeanName(self)
        .then(res => {
          return Util.ajax.post("", {
            type: "exec",
            mbean: res,
            operation: "removeTopic",
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
    changePage(count) {
      this.loading = true;
      this.init(false, count);
    },
    sendToMessage(name) {
      this.$router.push({
        name: "send_message",
        query: { destination: name, type: "Topic" }
      });
    },
    activeSubscribers(row) {
      this.$router.push({
        name: "activeSubscribers",
        query: { topic_name: row.Name }
      });
    },
    showAllproducers(row) {
      this.$router.push({
        name: "all-producers",
        params: { type: "Topic", queue_name: row.Name }
      });
    },
    init(first, count) {
      let self = this;
      Util.getBrokerName(self)
        .then(broker => {
          let topics = broker.Topics;
          let promises = topics.map(topic => {
            return Util.ajax.post("", {
              type: "read",
              mbean: topic.objectName
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
              this.data6 = arr.slice(0, this.pageSize);
            } else {
              this.data6 = arr;
            }
            this.loading = false;
          } else {
            if (length > this.pageSize * (count - 1)) {
              if (length < this.pageSize * count) {
                this.data6 = arr.slice(this.pageSize * (count - 1), length);
              } else {
                this.data6 = arr.slice(
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
  created() {
    this.init(true);
  }
};
</script>