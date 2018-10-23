<style lang="less">
.form-center {
  width: 80%;
}
</style>
<template>
    <div class="setting">
      <Form :model="formItem" :label-width="120" class="form-center">
          <FormItem label="首页数据刷新间隔">
            <Select v-model="formItem.interval">
                <Option v-for="item in intervalList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="submit()">保存</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancle()">取消</Button>
        </FormItem>  
      </Form>
    </div>
</template>
<script>
import Util from "@/libs/util";
export default {
  name: "setting",
  data() {
    return {
      intervalList: [
        {
          value: 5,
          label: "5秒"
        },
        {
          value: 10,
          label: "10秒"
        },
        {
          value: 15,
          label: "15秒"
        }
      ],
      formItem: {
        interval: null
      }
    };
  },
  methods: {
    submit() {
      this.formItem.interval
        ? this.$store.commit("setInterval", this.formItem.interval)
        : this.$Message.error("请选择适当时间间隔!");
      this.$Message.success("修改成功!");
    },
    cancle() {
      this.$router.push({
        name: "home_index"
      });
    }
  },
  created() {
    this.formItem.interval = this.$store.state.app.interval;
  },
  activated() {}
};
</script>
