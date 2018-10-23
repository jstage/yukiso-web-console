<style lang="less">

</style>

<template>
    <div class="subscribers">
        <Card style="height:200px;margin-bottom:10px;">
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                活跃持久主题订阅者
            </p>
            <p  slot="extra">
              <a style="margin-right:5px;" href="#" @click.prevent="addAdts">
                  <Icon type="plus"></Icon>
                  新增
              </a>
              <a class="hover-refresh" href="#" slot="extra" @click.prevent="initDurableTopicSubscribers()">
                    <Icon size="18" type="ios-loop-strong"></Icon>
                    刷新
              </a>
            </p>
            <Table height="100" :columns="columns1" :data="adts" size="small" stripe border ></Table>
        </Card>
        <Card style="height:200px;;margin-bottom:10px;">
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                离线持久主题订阅者
            </p>
            <p slot="extra">
              <a href="#" style="margin-right:5px;"  @click.prevent="addOdts">
                  <Icon type="plus"></Icon>
                  新增
              </a>
              <a class="hover-refresh" href="#" @click.prevent="initInactiveDurableTopicSubscribers()">
                    <Icon size="18" type="ios-loop-strong"></Icon>
                    刷新
              </a>
            </p>  
            <Table height="100" :columns="columns1" :data="odts" size="small" stripe border ></Table>
        </Card>
        <Card style="height:200px">
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                活跃非持久主题订阅者
            </p>
            <p slot="extra">
              <a href="#" style="margin-right:5px;" @click.prevent="addAndts">
                  <Icon type="plus"></Icon>
                  新增
              </a>
              <a class="hover-refresh" href="#" @click.prevent="initTopicSubscribers()">
                  <Icon size="18" type="ios-loop-strong"></Icon>
                  刷新
              </a>
            </p>
            <Table height="100" :columns="columns1" :data="andts" size="small" stripe border ></Table>
        </Card>
    </div>
</template>

<script>
import Util from "@/libs/util";
export default {
  name: "subscribers",
  data() {
    return {
      columns1: [
        {
          title: "客户端标识",
          key: "ClientId",
          render: (h, params) => {
            if (params.row.preadd) {
              let self = this;
              return h("Input", {
                domProps: {
                  value: params.row.ClientId
                },
                props: {
                  placeholder: "请输入"
                },
                on: {
                  input: function(event) {
                    params.row.ClientId = event;
                    self.$emit("input", event);
                  }
                }
              });
            }else{
              return h(
                "p",
                {
                  class: ["over-hidden", "over-hidden-hover"]
                },
                params.row.ClientId
              );
            }
          }
        },
        {
          title: "订阅者名称",
          key: "SubscriptionName",
          render: (h, params) => {
            if (params.row.preadd) {
              let self = this;
              return h("Input", {
                domProps: {
                  value: params.row.SubscriptionName
                },
                props: {
                  placeholder: "请输入"
                },
                on: {
                  input: function(event) {
                    params.row.SubscriptionName = event;
                    self.$emit("input", event);
                  }
                }
              });
            } else {
              return h(
                "p",
                {},
                Util.formats(params.row.SubscriptionName)
                  .formatEmpty()
                  .toString()
              );
            }
          }
        },
        {
          title: "连接标识",
          key: "ConnectionId",
          render: (h, params) => {
            return h(
              "p",
              {
                class: ["over-hidden", "over-hidden-hover"]
              },
              Util.formats(params.row.ConnectionId)
                .formatCompare("NOTSET", '无', params.row.ConnectionId)
                .toString()
            );
          }
        },
        {
          title: "选择器",
          key: "Selector",
          render: (h, params) => {
            if (params.row.preadd) {
              let self = this;
              return h("Input", {
                domProps: {
                  value: params.row.Selector
                },
                props: {
                  placeholder: "请输入"
                },
                on: {
                  input: function(event) {
                    params.row.Selector = event;
                    self.$emit("input", event);
                  }
                }
              });
            } else {
              return h(
                "p",
                {},
                Util.formats(params.row.Selector)
                  .formatEmpty()
                  .toString()
              );
            }
          }
        },
        {
          title: "目的地",
          key: "DestinationName",
          render: (h, params) => {
            if (params.row.preadd) {
              let self = this;
              return h("Input", {
                domProps: {
                  value: params.row.DestinationName
                },
                props: {
                  placeholder: "请输入"
                },
                on: {
                  input: function(event) {
                    params.row.DestinationName = event;
                    self.$emit("input", event);
                  }
                }
              });
            }else{
              return h(
                "p",
                {
                  class: ["over-hidden", "over-hidden-hover"]
                },
                params.row.DestinationName
              );
            }
          }
        },
        {
          title: "操作",
          key: "ClientId",
          render: (h, params) => {
            if (params.row.preadd) {
              return h("div", [
                h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      placement: "left-end",
                      title: "是否保存？"
                    },
                    on: {
                      "on-ok": () => {
                        this.save(params.row);
                      },
                      "on-cancle": () => {}
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
                        style: {
                          marginRight: "5px"
                        },
                        on: {
                          click: () => {}
                        }
                      },
                      "保存"
                    )
                  ]
                ),
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
                      click: () => {
                        this.deleteEdit(params.row.current, params.index);
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
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
                      this.delete(
                        params.row.ClientId,
                        params.row.SubscriptionName
                      );
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
      ],
      adts: [],
      odts: [],
      andts: []
    };
  },
  methods: {
    deleteEdit(current, index) {
      this[current].splice(index, 1);
    },
    addAdts() {
      this.adts.unshift({
        ClientId: "",
        SubscriptionName: "",
        DestinationName: "",
        ConnectionId: "NOTSET",
        Selector: "",
        preadd: "true",
        current: "adts"
      });
    },
    save(row) {
      let self = this;
      Util.mbeanName(self).then(res1 => {
        return Util.ajax
          .post("", {
            type: "exec",
            mbean: res1,
            operation:
              "createDurableSubscriber(java.lang.String, java.lang.String, java.lang.String, java.lang.String)",
            arguments: [
              row.ClientId,
              row.SubscriptionName,
              row.DestinationName,
              row.Selector
            ]
          })
          .then(() => {
            this.init();
          });
      });
    },
    addOdts() {
      this.odts.unshift({
        ClientId: "",
        SubscriptionName: "",
        ConnectionId: "NOTSET",
        DestinationName: "",
        Selector: "",
        preadd: "true",
        current: "odts"
      });
    },
    addAndts() {
      this.andts.unshift({
        ClientId: "",
        SubscriptionName: "",
        ConnectionId: "NOTSET",
        DestinationName: "",
        Selector: "",
        preadd: "true",
        current: "andts"
      });
    },
    changeLimit() {},
    delete(id, sub) {
      let self = this;
      Util.mbeanName(self).then(res1 => {
        return Util.ajax
          .post("", {
            type: "exec",
            mbean: res1,
            operation:
              "destroyDurableSubscriber(java.lang.String, java.lang.String)",
            arguments: [id, sub]
          })
          .then(() => {
            this.init();
          });
      });
    },
    fetchData(attribute) {
      let self = this;
      return Util.mbeanName(self)
        .then(res1 => {
          return Util.ajax.post("", {
            type: "read",
            mbean: res1,
            attribute: attribute
          });
        })
        .then(res2 => {
          let arr = res2.data.value;
          let promises = arr.map(obj => {
            return Util.ajax.post("", {
              type: "read",
              mbean: Object.values(obj)[0]
            });
          });
          return Promise.all(promises);
        })
        .then(list => {
          return list.map(one => {
            return one.data.value;
          });
        });
    },
    init() {
      this.initInactiveDurableTopicSubscribers();
      this.initTopicSubscribers();
      this.initDurableTopicSubscribers();
    },
    initInactiveDurableTopicSubscribers() {
      this.fetchData("InactiveDurableTopicSubscribers").then(res => {
        this.odts = res;
      });
    },
    initTopicSubscribers() {
      this.fetchData("TopicSubscribers").then(res => {
        this.andts = res;
      });
    },
    initDurableTopicSubscribers() {
      this.fetchData("DurableTopicSubscribers").then(res => {
        this.adts = res;
      });
    }
  },
  created() {
    this.init();
  }
};
</script>
