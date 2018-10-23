<style lang="less">

</style>

<template>
    <div class="send-message">
        <Form ref="formInline" :label-width="80" :rules="ruleValidate" :model="formInline">
            <Row>
                <Col span="14">
                    <Row>
                        <Col span="11">
                            <FormItem prop="JMSDestination" label="目的地">
                                <Input :disabled="isDisabled" v-model="formInline.JMSDestination" placeholder="目的地">
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem prop="JMSDestinationType" label="目的地类型">
                                <Select :disabled="isDisabled" v-model="formInline.JMSDestinationType">
                                    <Option value="Topic">主题</Option>
                                    <Option value="Queue">队列</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem prop="JMSCorrelationID" label="关联消息">
                                <Input v-model="formInline.JMSCorrelationID" placeholder="消息标识">
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem prop="JMSDeliveryMode" label="持久化消息">
                                <i-switch v-model="formInline.JMSDeliveryMode" size="large">
                                    <span slot="open">是</span>
                                    <span slot="close">否</span>
                                </i-switch>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem prop="JMSReplyTo" label="回复">
                                <Input v-model="formInline.JMSReplyTo" placeholder="回复目的地">
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem prop="JMSPriority" label="优先级">
                                <Input v-model="formInline.JMSPriority" placeholder="优先级">
                                </Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem prop="JMSType" label="类型">
                                <Input v-model="formInline.JMSType" placeholder="类型">
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem prop="JMSTimeToLive" label="保留时间">
                                <Input v-model="formInline.JMSTimeToLive" placeholder="保留时间">
                                </Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem prop="JMSXGroupID" label="消息组">
                                <Input v-model="formInline.JMSXGroupID" placeholder="消息组">
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem prop="JMSXGroupSeq" label="组内序号">
                                <Input v-model="formInline.JMSXGroupSeq" placeholder="组内序号">
                                </Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem prop="AMQ_SCHEDULED_DELAY" label="定时延迟(ms)">
                                <Input v-model="formInline.AMQ_SCHEDULED_DELAY" placeholder="定时延迟(ms)">
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem prop="AMQ_SCHEDULED_PERIOD" label="定时周期(ms)">
                                <Input v-model="formInline.AMQ_SCHEDULED_PERIOD" placeholder="定时周期(ms)">
                                </Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem prop="AMQ_SCHEDULED_REPEAT" label="调度重复次数">
                                <Input v-model="formInline.AMQ_SCHEDULED_REPEAT" placeholder="调度重复次数">
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem prop="AMQ_SCHEDULED_CRON" label="Cron表达式">
                                <Input v-model="formInline.AMQ_SCHEDULED_CRON" placeholder="Cron表达式">
                                </Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem prop="JMSMessageCount" label="消息数量">
                                <InputNumber :min="1" v-model="JMSMessageCount" placeholder="消息数量">
                                </InputNumber >
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formInline')">发送</Button>
                        <Button type="ghost" @click="handleReset('formInline')" style="margin-left: 2em">重置</Button>
                    </FormItem>

                </Col>
                <Col span="10">
                     <Card>
                         <p slot="title">
                            <Icon type="ios-film-outline"></Icon>
                            消息内容
                        </p>
                        <Input v-model="JMSText" type="textarea" :autosize="{minRows: 2}" placeholder="消息内容"></Input>
                     </Card>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
import Util from "@/libs/util";
export default {
  name: "send-message",
  data() {
    return {
      isDisabled: false,
      formInline: {
        JMSDestination: "",
        JMSDestinationType: "",
        JMSCorrelationID: "",
        JMSDeliveryMode: false,
        JMSReplyTo: "",
        JMSPriority: "",
        JMSType: "",
        JMSTimeToLive: "",
        JMSXGroupID: "",
        JMSXGroupSeq: "",
        AMQ_SCHEDULED_DELAY: "",
        AMQ_SCHEDULED_PERIOD: "",
        AMQ_SCHEDULED_REPEAT: "",
        AMQ_SCHEDULED_CRON: ""
      },
      ruleValidate: {
        JMSDestination: [
          {
            required: true,
            message: "请填写目的地名称",
            trigger: "blur"
          }
        ],
        JMSDestinationType: [
          {
            required: true,
            message: "请填写目的地类型",
            trigger: "change"
          }
        ]
      },
      JMSText: "",
      JMSMessageCount: 1
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.handle(name);
        } else {
          this.$Message.error("校验未通过，请检查!");
        }
      });
    },
    handle(name) {
      let count = parseInt(this.JMSMessageCount);
      let self = this;
      if (this.JMSMessageCount && count > 0) {
        for (let i = 0; i < count; i++) {
          if (this.formInline.JMSReplyTo) {
            Util.mbeanName(self)
              .then(broker => {
                return Util.ajax.post("", {
                  type: "exec",
                  mbean: broker,
                  operation: "addQueue(java.lang.String)",
                  arguments: [this.formInline.JMSReplyTo]
                });
              })
              .then(res => {
                if (res.data.status == 200) {
                  return Util.ajax.post("", {
                    type: "read",
                    mbean:
                      broker +
                      ",destinationType=Queue,destinationName=" +
                      this.formInline.JMSReplyTo
                  });
                }
              })
              .then(queue => {
                this.formInline.JMSReplyTo = queue.data.value;
                let copy = {};
                Object.keys(this.formInline).forEach(ele => {
                  if (this.formInline[ele] != "") {
                    copy[ele] = this.formInline[ele];
                  }
                });
                return Util.ajax.post("", {
                  type: "exec",
                  mbean:
                    broker +
                    ",destinationType=" +
                    this.formInline.destinationType +
                    ",destinationName=" +
                    this.formInline.JMSDestination,
                  operation:
                    "sendTextMessage(java.util.Map,java.lang.String,java.lang.String,java.lang.String)",
                  arguments: [copy, this.JMSText, "", ""]
                });
              })
              .then(() => {
                if(i === count-1){
                    this.handleReset(name);
                    this.$Message.success("发送成功!");
                }
              });
          } else {
            let copy = {};
            Object.keys(this.formInline).forEach(ele => {
              if (
                this.formInline[ele] != "" &&
                ele != "JMSDestinationType" &&
                ele != "JMSDestination"
              ) {
                copy[ele] = this.formInline[ele];
              }
            });
            Util.mbeanName(self)
              .then(broker => {
                return Util.ajax.post("", {
                  type: "exec",
                  mbean:
                    broker +
                    ",destinationType=" +
                    this.formInline.JMSDestinationType +
                    ",destinationName=" +
                    this.formInline.JMSDestination,
                  operation:
                    "sendTextMessage(java.util.Map,java.lang.String,java.lang.String,java.lang.String)",
                  arguments: [copy, this.JMSText, "", ""]
                });
              })
              .then(() => {
                  // this.$Message.success("发送成功!");
                if(i === count-1){
                    this.handleReset(name);
                    this.$Message.success("发送成功!");
                }
              });
          }
        }
      }
    },
    removeNullProperty() {},
    handleReset(name) {
      this.$refs[name].resetFields();
      this.JMSText = "";
      this.JMSMessageCount = 1;
      this.init();
    },
    init() {
      if (this.$route.query.destination && this.$route.query.type) {
        let name = this.$route.query.destination;
        let type = this.$route.query.type;
        this.formInline.JMSDestination = name;
        this.formInline.JMSDestinationType = type;
        this.isDisabled = true;
      }
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  }
};
</script>
