<style lang="less">
@import "../styles/unlock.less";
</style>

<template>
    <transition name="show-unlock">
        <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
            <div @click="handleClickAvator" class="unlock-avator-con" :style="{marginLeft: avatorLeft}">
                <img class="unlock-avator-img" src="../../../../images/icon.jpg">
                <div  class="unlock-avator-cover">
                    <span><Icon type="unlocked" :size="30"></Icon></span>
                    <p>解锁</p>
                </div>
            </div>
            <div class="unlock-avator-under-back" :style="{marginLeft: avatorLeft}"></div>
            <div class="unlock-input-con">
                <div class="unlock-input-overflow-con">
                    <div class="unlock-overflow-body" :style="{right: inputLeft}">
                        <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="密码同登录密码" />
                        <button ref="unlockBtn" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock" class="unlock-btn"><Icon color="white" type="key"></Icon></button>
                    </div>
                </div>
            </div>
            <div class="unlock-locking-tip-con">已锁定</div>
            <a v-if="fail" @click="returnLogin" class="return-login">返回登录</a>
        </div>
    </transition>
</template>

<script>
import Cookies from "js-cookie";
import Util from "@/libs/util";
import axios from "axios";
import qs from "qs";
export default {
  name: "Unlock",
  data() {
    return {
      avatorLeft: "0px",
      inputLeft: "400px",
      password: "",
      check: null,
      fail: false
    };
  },
  props: {
    showUnlock: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    avatorPath() {
      return localStorage.avatorImgPath;
    }
  },
  methods: {
    returnLogin() {
      this.$store.commit("logout", this);
      this.$store.commit("clearOpenedSubmenu");
      this.$router.push({
        replace: true,
        name: "login"
      });
    },
    validator() {
      return axios
        .create({
          baseURL: Util.ajaxUrl,
          timeout: 30000,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.JWT_TOKEN
          }
        })
        .post("/validate", qs.stringify({ password: this.password }));
      // 你可以在这里写密码验证方式，如发起ajax请求将用户输入的密码this.password与数据库用户密码对比
    },
    handleClickAvator() {
      this.avatorLeft = "-180px";
      this.inputLeft = "0px";
      this.$refs.inputEle.focus();
    },
    handleUnlock() {
      this.validator().then(
        res => {
          this.avatorLeft = "0px";
          this.inputLeft = "400px";
          this.password = "";
          Cookies.set("locking", "0");
          this.$emit("on-unlock");
        },
        error => {
          this.$Message.error("密码错误或已失效,请重新输入或者登录!");
          this.fail = true;
        }
      );
    },
    unlockMousedown() {
      this.$refs.unlockBtn.className = "unlock-btn click-unlock-btn";
    },
    unlockMouseup() {
      this.$refs.unlockBtn.className = "unlock-btn";
    }
  }
};
</script>
