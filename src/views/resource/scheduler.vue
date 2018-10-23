<style lang="less">

</style>
<template>
    <div class="network">
        <Card style="width:100%">
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                定时消息
            </p>
            <a class="hover-refresh" href="#" slot="extra" @click.prevent="refresh">
                <Icon size="18" type="ios-loop-strong"></Icon>
                刷新
            </a>
            <Table v-if="isSchedulerStarted" :columns="columns" :data="schedulers"></Table>
            <p v-else>
                定时消息未开启!
            </p>
        </Card>
    </div>
</template>
<script>
import Util from '@/libs/util'
export default {
  name: "scheduler",
  data() {
    return {
      isSchedulerStarted:false,
      columns: [
        {
          title: "标识",
          key: "jobId",
          render:(h,params) => {
            return h('p',{class: ["over-hidden", "over-hidden-hover"]},params.row.jobId);
          }
        },
        {
          title: "Cron表达式",
          key: "cronEntry",
          render:(h,params) => {
            return h('p',{},Util.formats(params.row.cronEntry).formatEmpty().toString());
          }
        },
        {
          title: "下次调度时间",
          key: "next",
          render:(h,params) => {
            return h('p',{},Util.formats(params.row.next).formatEmpty().toString());
          }
        },
        {
          title: "开始时间",
          key: "start",
          render:(h,params) => {
            return h('p',{},Util.formats(params.row.start).formatEmpty().toString());
          }
        },
        {
          title: "延迟时间(ms)",
          key: "delay",
          render:(h,params) => {
            return h('p',{},Util.formats(params.row.delay).formatEmpty().toString());
          }
        },
        {
          title: "周期(ms)",
          key: "period",
          render:(h,params) => {
            return h('p',{},Util.formats(params.row.period).formatEmpty().toString());
          }
        },
        {
          title: "重复次数",
          key: "repeat",
          render:(h,params) => {
            return h('p',{},Util.formats(params.row.repeat).formatEmpty().toString());
          }
        },
        {
          title: "操作",
          key: "jobId",
          render: (h, params) => {
            return h("div", [
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    placement: "left-end",
                    title: "您确认删除此项吗？"
                  },
                  on: {
                    "on-ok": () => {
                      this.delete(params.row.jobId);
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
      schedulers: [],
      scheduler:''
    };
  },
  methods: {
    delete(jobId){
        Util.ajax.post('',{
          'mbean':this.scheduler,
          'type':'exec',
          'operation': "removeJob",
          'arguments': [jobId]
        }).then( res => {
           let data = res.data;
           if(data.status = 200){
              this.$Notice.success({
                title: "操作成功!",
                duration: 1,
                onClose: () => {
                  this.init();
                }
              });
           }
        })
    },
    refresh(){
      this.init();
    },
    init() {
      let self = this;
        Util.mbeanName(self).then(broker => {
            return Util.ajax.post('',{
                'mbean':broker,
                'type' : "read"
            })
        }).then(res => {
            this.isSchedulerStarted = false;
            let result = res.data;
            if(result.status == 200){
                let scheduler = result.value.JMSJobScheduler;
                if(scheduler){
                    // this.schedulers = [];
                    this.scheduler = scheduler.objectName;
                    return Util.ajax.post('',{
                      'mbean':scheduler.objectName,
                      'type':'read'
                    })
                }else{
                    // this.schedulers = [];
                    return null;
                }
            }
        }).then(res => {
            if (!res)
              return;
            let result = res.data;
            this.isSchedulerStarted = true;
            if(result.status === 200){
              let jobs = result.value.AllJobs;
              if(jobs){
                 this.schedulers = Object.values(jobs);
              }
            }
        }) 
    }
  },
  created() {
    this.init();
  },
  activated(){
    this.init();
  }
};
</script>
