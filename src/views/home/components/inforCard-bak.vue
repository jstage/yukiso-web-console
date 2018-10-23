<style lang="less">
@import "./styles/infor-card.less";
.infor-card-con-hover{
   // relative:相对定位
    position:relative;
    z-index:1;
    font-weight: bold;
    font-size: 12px;
    color:#f88112;
    font-family:宋体;
    display: none;
}
.infor-card-con{
    cursor: pointer;
}
.infor-card-con:hover .infor-card-con-hover{
    display: block;
}
</style>

<template>
    <Card :padding="0">
        <div class="infor-card-con">
            <Col class="infor-card-icon-con" :style="{backgroundColor: color, color: 'white'}" span="8">
                <Row class="height-100" type="flex" align="middle" justify="center">
                    <Icon :class="{rotate:iconRotate}" :type="iconType" :size="iconSize"></Icon>
                </Row>
            </Col>
            <Col span="16" class="height-100">
                <Row type="flex" align="middle" justify="center" class="height-100">
                    <div v-if="type == 'number'">
                        <count-up 
                            class="infor-card-count user-created-count" 
                            :id-name="idName" 
                            :end-val="endVal" 
                            :color="color"
                            :countSize="countSize"
                            :countWeight="countWeight"
                        >
                            <p class="infor-intro-text" slot="intro">{{ introText }}</p>
                        </count-up>
                    </div>
                    <div class="timeDiv" v-else>
                        <p :title="timeText" class="timeText">{{timeText}}</p>
                        <p class="infor-intro-text">{{ introText }}</p>
                    </div>
                </Row>
            </Col>
            <div v-if="isShowTotalMessageCount" class='infor-card-con-hover'>
                   队列未被确认消息总量 :{{queueSize}}
            </div>
             <div v-if="isShowTotalDequeueCount" class='infor-card-con-hover'>
                <div>队列出队总数 :{{QdequeueCount}}</div>
                <div>主题出队总数 :{{TdequeueCount}}</div>
            </div>
            <div v-if="isShowTotalEnqueueCount" class='infor-card-con-hover'>
                <div>队列入队总数 :{{QenqueueCount}}</div>
                <div>主题入队总数 :{{TenqueueCount}}</div>       
            </div>
        </div>
    </Card>
</template>

<script>
import countUp from './countUp.vue';
import Util from "@/libs/util";

export default {
    name: 'inforCard',
    components: {
        countUp
    },
    data(){
        return {
          //  timeText:'',
            queueSize:0,
            QdequeueCount:0,
            TdequeueCount:0,
            QenqueueCount:0,
            TenqueueCount:0,
        }
    },
    methods:{
        formatDuring: (mss) =>{
            let days = parseInt(mss / (1000 * 60 * 60 * 24)) ;
            days = days ? days + " 天 " : '';
            let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            hours = hours ? hours + " 小时 " : '';
            let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            minutes = minutes ? minutes + " 分钟 " : '';
            let seconds = Math.round((mss % (1000 * 60)) / 1000);
            seconds = seconds ? seconds + " 秒 " : '';
            return days + hours + minutes + seconds;
        },
          /**@augments
         * forEach:遍历无返回值
         *  map:遍历有返回值数组
         *  filter：
         *  reduce:数组累加
         * 此方法用于显示totalMessage的数量
         */
        showTotalMessage(){
            let self = this;
            Util.getBrokerName().then(broker => {
                let queues = broker.Queues;
                let promises = queues.map((ele) => {
                    return Util.ajax.post('',{
                        type:'read',
                        mbean:ele.objectName
                    })
                });
                return Promise.all(promises);
            }).then(results =>{
                this.queueSize = results.reduce((total,num) => {
                    return total + num.data.value.QueueSize
                },0)
            
            })
        },
        // 显示broker里队列的所有出队总量
        showQDequeueCount(){
            let selt=this;
            Util.getBrokerName().then(broker=>{
                let queues = broker.Queues;
                 let promises = queues.map((ele) => {
                    return Util.ajax.post('',{
                        type:'read',
                        mbean:ele.objectName
                    })
                });
                 return Promise.all(promises);
            }).then(results=>{
                 this.QdequeueCount=results.reduce((total,num)=>{
                   //  console.log(num);
                   return total + num.data.value.DequeueCount
                },0)
            })
        },
          // 显示broker里主题的所有出队总量
        showTDequeueCount(){
            let selt=this;
            Util.getBrokerName().then(broker=>{
                let topics = broker.Topics;
                 let promises = topics.map((ele) => {
                    return Util.ajax.post('',{
                        type:'read',
                        mbean:ele.objectName
                    })
                });
                 return Promise.all(promises);
            }).then(results=>{
                 this.TdequeueCount=results.reduce((total,num)=>{
                 //    console.log(num);
                   return total + num.data.value.DequeueCount
                },0)
            })
        }, 
        
        // 显示broker里总的所有出队总量
        showTotalDequeueCount(){
            this.showQDequeueCount();
            this.showTDequeueCount();     
        },

        // 显示broker里队列的所有入队总量
        showQEnqueueCount(){
            let selt=this;
            Util.getBrokerName().then(broker=>{
                let queues = broker.Queues;
                 let promises = queues.map((ele) => {
                    return Util.ajax.post('',{
                        type:'read',
                        mbean:ele.objectName
                    })
                });
                 return Promise.all(promises);
            }).then(results=>{
                 this.QenqueueCount=results.reduce((total,num)=>{
                    return total + num.data.value.EnqueueCount
                },0)
                console.log("Qe:::"+this.QenqueueCount);
            })
        },
          // 显示broker里主题的所有入队总量
        showTEnqueueCount(){
            let selt=this;
            Util.getBrokerName().then(broker=>{
                let topics = broker.Topics;
                 let promises = topics.map((ele) => {
                    return Util.ajax.post('',{
                        type:'read',
                        mbean:ele.objectName
                    })
                });
                 return Promise.all(promises);
            }).then(results=>{
                 this.TenqueueCount=results.reduce((total,num)=>{
                     console.log("Te:"+this.TenqueueCount);
                   return total + num.data.value.EnqueueCount
                },0)
                console.log("Te:::"+this.TenqueueCount);
            })
        }, 
        

          // 显示broker里的所有入队总量
        showTotalEnqueueCount(){
            this.showQEnqueueCount();
            this.showTEnqueueCount();
        },
    },
    props: {
        idName: String,
        endVal: Number,
        color: String,
        iconType: String,
        introText: String,
        countSize: {
            type: String,
            default: '30px'
        },
        countWeight: {
            type: Number,
            default: 700
        },
        iconSize: {
            type: Number,
            default: 40
        },
        iconRotate: {
            type: Boolean,
            default: false
        },
        type:{
            type:String,
            default:'number'
        },
        isShowTotalMessageCount:{
            type:Boolean,
            default:false
        },
        isShowTotalEnqueueCount:{
            type:Boolean,
            default:false
        },
        isShowTotalDequeueCount:{
            type:Boolean,
            default:false
        }
    },
    mounted(){
        if(this.isShowTotalMessageCount){ 
            this.showTotalMessage();
        }
        if(this.isShowTotalEnqueueCount){
            this.showTotalEnqueueCount();
        }
        if(this.isShowTotalDequeueCount){
            this.showTotalDequeueCount();
        }
        
        // if(this.type != 'number'){
        //     this.timeText = this.formatDuring(this.endVal);
        // }
    },
    computed:{
        timeText(){
            if(this.type != 'number'){
                return this.formatDuring(this.endVal);
            }
        }
    }
};
</script>

