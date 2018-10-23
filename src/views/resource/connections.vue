<style lang="less">
.m-10 {
  margin-bottom: 10px;
}
</style>
<template>
  <div class="connections">
    <Row :gutter="16" class="m-10">
        <Col span="12">
            <Card style="width:100%">
                <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                    mqtt连接
                </p>
                <a class="hover-refresh" href="#" slot="extra" @click.prevent="refresh('mqtts')">
                    <Icon size="18" type="ios-loop-strong"></Icon>
                    刷新
                </a>
                <Table :height="120" :columns="columns1" :data="mqtts"></Table>
            </Card>
        </Col>
        <Col span="12">
            <Card style="width:100%">
                <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                    stomp连接
                </p>
                <a class="hover-refresh" href="#" slot="extra" @click.prevent="refresh('stomps')">
                    <Icon size="18" type="ios-loop-strong"></Icon>
                    刷新
                </a>
                <Table :height="120" :columns="columns1" :data="stomps"></Table>
            </Card>
        </Col>
    </Row>
    <Row :gutter="16" class="m-10">
        <Col span="12">
            <Card style="width:100%">
                <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                    amqp连接
                </p>
                <a class="hover-refresh" href="#" slot="extra" @click.prevent="refresh('amqps')">
                    <Icon size="18" type="ios-loop-strong"></Icon>
                    刷新
                </a>
                <Table :height="120" :columns="columns1" :data="amqps"></Table>
            </Card>
        </Col>
        <Col span="12">
            <Card style="width:100%">
                <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                    openwire连接
                </p>
                <a class="hover-refresh" href="#" slot="extra" @click.prevent="refresh('openwires')">
                    <Icon size="18" type="ios-loop-strong"></Icon>
                    刷新
                </a>
                <Table :height="120" :columns="columns1" :data="openwires"></Table>
            </Card>
        </Col>
    </Row>
    <Card style="width:100%">
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            Network连接
        </p>
        <a class="hover-refresh" href="#" slot="extra" @click.prevent="refresh('networks')">
            <Icon size="18" type="ios-loop-strong"></Icon>
            刷新
        </a>
        <Table :columns="columns2" :data="networks"></Table>
    </Card>
    <Modal width="1200" v-model="showInfo" title="消费者信息">
        <Table :columns="columns3" :data="consumers"></Table>
    </Modal>
  </div>
</template>
<script>
import Util from "@/libs/util";
export default {
  name: "connections",
  data() {
    return {
      showInfo: false,
      columns1: [
        {
          title: "客户端标识",
          key: "ClientId",
          render: (h, params) => {
            return h(
              "p",
              {
                class: ["over-hidden", "over-hidden-hover"]
              },
              [
                h(
                  "a",
                  {
                    on: {
                      click: () => {
                        this.scanConsumers(params.row.Consumers);
                      }
                    }
                  },
                  params.row.ClientId
                )
              ]
            );
          }
        },
        {
          title: "远端地址",
          key: "RemoteAddress"
        },
        {
          title: "正常运行",
          key: "Active",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.Active)
                .formatBoolean()
                .toString()
            );
          }
        },
        {
          title: "慢速消费者",
          key: "Slow",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.Slow)
                .formatBoolean()
                .toString()
            );
          }
        }
      ],
      columns2: [
        {
          title: "连接名称",
          key: "Name",
          width: "100"
        },
        {
          title: "用于消息的broker数量",
          key: "MessageTTL"
        },
        {
          title: "用于消费的broker数量",
          key: "ConsumerTTL"
        },
        {
          title: "仅动态",
          key: "DynamicOnly",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.DynamicOnly)
                .formatBoolean()
                .toString()
            );
          }
        },
        {
          title: "单消费者",
          key: "ConduitSubscriptions",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.ConduitSubscriptions)
                .formatBoolean()
                .toString()
            );
          }
        },
        {
          title: "广播advisory messages",
          key: "BridgeTempDestinations",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.BridgeTempDestinations)
                .formatBoolean()
                .toString()
            );
          }
        },
        {
          title: "消费者优先权",
          key: "DecreaseNetworkConsumerPriority",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.DecreaseNetworkConsumerPriority)
                .formatBoolean()
                .toString()
            );
          }
        },
        {
          title: "异步分发",
          key: "DispatchAsync",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.DispatchAsync)
                .formatBoolean()
                .toString()
            );
          }
        }
      ],
      columns3: [
        {
          title: "目的地名称",
          key: "DestinationName",
          render:(h,params) =>{
             return h('p',{
               'class': ["over-hidden", "over-hidden-hover"]
             },params.row.DestinationName);
          }
        },
        {
          title: "会话标识",
          key: "SessionId"
        },
        {
          title: "消息选择器",
          key: "Selector",
          render: (h, params) => {
            return h(
              "p",
              {},
              Util.formats(params.row.Selector)
                .formatEmpty()
                .toString()
            );
          }
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
              h(
                "p",
                {},
                Util.formats(params.row.Exclusive)
                  .formatBoolean()
                  .toString()
              ),
              h(
                "p",
                {},
                Util.formats(params.row.Retroactive)
                  .formatBoolean()
                  .toString()
              )
            ]);
          }
        }
      ],
      mqtts: [],
      stomps: [],
      amqps: [],
      openwires: [],
      networks: [],
      consumers: []
    };
  },
  methods: {
    refresh(type){
      this[type] = [];
      this.init(type);
    },
    scanConsumers(consumers) {
      this.consumers = [];
      if (consumers.length == 1) {
        let mbean = consumers[0].objectName;
        Util.ajax
          .post("", {
            type: "read",
            mbean: mbean
          })
          .then(res => {
            this.consumers.push(res.data.value);
            this.showInfo = true;
          },error =>{
            this.$store.commit("logout", vm);
            this.$store.commit("clearOpenedSubmenu");
            this.$router.push({
                name: "login",
            });
          });
      } else if (consumers.length > 1) {
        consumers.forEach(ele => {
          let mbean = ele.objectName;
          Util.ajax
            .post("", {
              type: "read",
              mbean: mbean
            })
            .then(res => {
              this.consumers.push(res.data.value);
              this.showInfo = true;
            },error => {
                this.$store.commit("logout", vm);
                this.$store.commit("clearOpenedSubmenu");
                this.$router.push({
                    name: "login",
                });
            });
        });
      }
    },
    init(type) {
      let flag = true;
      if(type){
        flag = false;
      }
      Util.ajax
        .post("", {
          mbean: Util.mbean()+":*",
          type: "read"
        })
        .then(
          res => {
            let datas = res.data.value;
            let connectors = [];
            Object.keys(datas).forEach(key => {
              if (
                key.indexOf("connectionViewType=clientId") > -1 &&
                key.indexOf("connector=clientConnectors") > -1 &&
                key.indexOf("connectorName") > -1
              ) {
                if (key.indexOf("mqtt") > -1 && (type === 'mqtts' || flag)) {
                  this.mqtts.push(datas[key]);
                  return;
                }
                if (key.indexOf("stomp") > -1 && (type === 'stomps' || flag)) {
                  this.stomps.push(datas[key]);
                  return;
                }
                if (key.indexOf("amqp") > -1 && (type === 'amqps' || flag)) {
                  this.amqps.push(datas[key]);
                  return;
                }
                if (key.indexOf("openwire") > -1 && (type === 'openwires' || flag)) {
                  this.openwires.push(datas[key]);
                  return;
                }
              } else if (
                key.indexOf("connector=networkConnectors") > -1 &&
                key.indexOf("networkConnectorName") > -1 &&
                key.indexOf("networkBridge") < 0 && (type === 'networks' || flag)
              ) {
                this.networks.push(datas[key]);
              }
            });
          },
          error => {
            if (error.response) {
              if (error.response.status == 401) {
                this.$store.commit("logout", vm);
                this.$store.commit("clearOpenedSubmenu");
                this.$router.push({
                    name: "login",
                });
              }
            }
          }
        );
    }
  },
  created() {
    this.init();
  }
};
</script>

