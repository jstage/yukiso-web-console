<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="8">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row type="flex" class="user-infor">
                                <Col span="8">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <img class="avator-img" src="@/images/icon.jpg" />
                                    </Row>
                                </Col>
                                <Col span="16" style="padding-left:6px;">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <div>
                                            <b class="card-user-infor-name">{{ username }}</b>
                                            <p>当前用户</p>
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <div class="line-gray"></div>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">节点名称:</p></Col>
                                <Col span="16" class="padding-left-8">{{ broker.BrokerName }}</Col>
                            </Row>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">持久化存储:</p></Col>
                                <Col span="16" v-if="broker.Persistent" class="padding-left-8">{{ broker.Persistent | transform }}</Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col :md="12" :lg="24" :style="{marginBottom:'10px'}">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="stats-bars"></Icon>
                                节点统计
                            </p>
                            <ul class="stats-bars-list">
                                <li>
                                    <i-circle :percent="100" :size="100">
                                        <count-up 
                                            v-if="broker.CurrentConnectionsCount >=0"
                                            id-name="connectionCount" 
                                            :end-val="broker.CurrentConnectionsCount" 
                                            color="rgb(45, 183, 245)"
                                            countSize="20px"
                                            :countWeight="parseInt(200)"
                                        >
                                            <p class="infor-intro-text" slot="intro">当前连接数</p>
                                        </count-up>
                                    </i-circle>
                                </li>
                                <li>
                                    <i-circle :percent="100" :size="100" stroke-color="#5cb85c">
                                        <count-up 
                                            v-if="broker.Queues"
                                            id-name="queueCount" 
                                            :end-val="broker.Queues.length" 
                                            color="#5cb85c"
                                            countSize="20px"
                                            :countWeight="parseInt(200)"
                                        >
                                            <p class="infor-intro-text" slot="intro">队列总数</p>
                                        </count-up>
                                    </i-circle>
                                </li>
                                <li>
                                    <i-circle :percent="100" :size="100" stroke-color="#ff5500">
                                        <count-up 
                                            v-if="broker.Topics"
                                            id-name="topicCount" 
                                            :end-val="broker.Topics.length" 
                                            color="#ff5500"
                                            countSize="20px"
                                            :countWeight="parseInt(200)"
                                        >
                                            <p class="infor-intro-text" slot="intro">主题总数</p>
                                        </count-up>
                                    </i-circle>
                                </li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col :md="24" :lg="16">
                <Row :gutter="5">
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                      <infor-card
                            v-if="broker.UptimeMillis"
                            id-name="runtime_count"
                            :end-val="broker.UptimeMillis"
                            iconType="android-time"
                            color="#2d8cf0"
                            :iconSize="50"
                            intro-text="运行时间"
                            type="time"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                           :end-val="broker.TotalMessageCount"
                            iconType="arrow-swap"
                            color="#64d572"
                            :iconSize="50"
                            :iconRotate="true"
                            intro-text="未确认的消息总量"    id-name="visit_count"
                            v-if="broker.TotalMessageCount >= 0"
                            :isShowTotalMessageCount="true"
                         > </infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="collection_count"
                            v-if="broker.TotalDequeueCount >= 0"
                            :end-val="broker.TotalDequeueCount"
                            iconType="android-upload"
                            color="#ffd572"
                            intro-text="出队总数"
                            :isShowTotalDequeueCount="true"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="transfer_count"
                            v-if="broker.TotalEnqueueCount >= 0"
                            :end-val="broker.TotalEnqueueCount"
                            iconType="android-download"
                            color="#f25e43"
                            intro-text="入队总数"
                            :isShowTotalEnqueueCount="true"
                        ></infor-card>
                    </Col>
                </Row>
                <Row>
                    <Card  style="height:100%" :padding="0">
                        <p slot="title" class="card-title">
                            <Icon type="ios-shuffle-strong"></Icon>
                            节点拓扑图
                        </p>
                        <div class="scanner" slot="extra" @click.prevent="handleZoom">
                            <Tooltip  content="放大" placement="top">
                                <Icon type="qr-scanner" size="20"></Icon>
                            </Tooltip>
                        </div>
                        <div class="line-chart-con custom">
                            <node-topology node="node1" :height="smallNode"></node-topology>
                        </div>
                        <Modal :styles="{top: '20px'}" scrollable width="1200" class-name="modal-large" v-model="modal">
                            <node-topology v-if="modal" node="node2" :height="largeNode"></node-topology>
                        </Modal>
                    </Card>
                </Row>
            </Col>
        </Row>
      <!--   <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        上周每日来访量统计
                    </p>
                    <div class="data-source-row">
                        <visite-volume></visite-volume>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        数据来源统计
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-wifi"></Icon>
                        各类用户服务调用变化统计
                    </p>
                    <div class="data-source-row">
                        <user-flow></user-flow>
                    </div>
                </Card>
            </Col>
        </Row>-->

         <Row class="margin-top-10">
            <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                       线程监控图
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                   JVM内存监控图
                </p>
                <div class="line-chart-con">
                    <!-- <service-requests></service-requests> -->
                    <internalMemory></internalMemory>
                </div>
            </Card>
        </Row>
        
    </div>
</template>

<script>
import cityData from "./map-data/get-city-value.js";
import homeMap from "./components/map.vue";
import dataSourcePie from "./components/dataSourcePie.vue";
import visiteVolume from "./components/visiteVolume.vue";
import serviceRequests from "./components/serviceRequests.vue";
import userFlow from "./components/userFlow.vue";
import countUp from "./components/countUp.vue";
import inforCard from "./components/inforCard.vue";
import mapDataTable from "./components/mapDataTable.vue";
import toDoListItem from "./components/toDoListItem.vue";
import nodeTopology from "./components/nodeTopology.vue";
import internalMemory from "./components/internalMemory.vue";
import Util from "@/libs/util";
export default {
  name: "home",
  components: {
    homeMap,
    dataSourcePie,
    visiteVolume,
    serviceRequests,
    userFlow,
    countUp,
    inforCard,
    mapDataTable,
    toDoListItem,
    nodeTopology,
    internalMemory
  },
  data() {
    return {
    //   isShow:false,
      smallNode:305,
      largeNode:600,  
      modal:false,
      toDoList: [
        {
          title: "去iView官网学习完整的iView组件"
        },
        {
          title: "去iView官网学习完整的iView组件"
        },
        {
          title: "去iView官网学习完整的iView组件"
        },
        {
          title: "去iView官网学习完整的iView组件"
        },
        {
          title: "去iView官网学习完整的iView组件"
        }
      ],
      count: {
        createUser: 496,
        visit: 3264,
        collection: 24389305,
        transfer: 39503498
      },
      cityData: cityData,
      showAddNewTodo: false,
      newToDoItemValue: "",
      broker: Object,
      username:''
    };
  },
  computed: {
    avatorPath() {
      return localStorage.avatorImgPath;
    }
  },
  methods: {
    handleZoom(){
        this.modal = true;
    },
    addNewToDoItem() {
      this.showAddNewTodo = true;
    },
    addNew() {
      if (this.newToDoItemValue.length !== 0) {
        this.toDoList.unshift({
          title: this.newToDoItemValue
        });
        setTimeout(() => {
          this.newToDoItemValue = "";
        }, 200);
        this.showAddNewTodo = false;
      } else {
        this.$Message.error("请输入待办事项内容");
      }
    },
    cancelAdd() {
      this.showAddNewTodo = false;
      this.newToDoItemValue = "";
    },
    init() {
     Util.ajax.get('/getUsername').then(res => {
         this.username = res.data;
     })
      Util.mbeanName()
        .then(res1 => {
          return Util.ajax.post("", {
            type: "read",
            mbean: res1
          });
        })
        .then(res => {
          this.broker = res.data.value;
        });
    }
  },
  created() {
    //此处调用api 获取broker名称
    this.init();
  },
  mounted() {
    this.init();
  }
};
</script>
