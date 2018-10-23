<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录金蝶消息中间件
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="username">
                            <Input v-model="form.username" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">金蝶天燕中间件股份有限公司 Copyright &copy; 2018</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Util from '@/libs/util';
import axios from 'axios';
import qs from 'qs'
export default {
    data () {
        return {
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    axios.create({
                        baseURL: Util.ajaxUrl,
                        timeout: 30000,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).post('/login',qs.stringify(this.form)).then(res => {
                        if(res){
                            localStorage.JWT_TOKEN ='';
                            localStorage.JWT_TOKEN = res.headers.authorization;
                            Cookies.set('access', 0);
                            Cookies.set('locking', 0);
                            this.$Message.success('登录成功!');
                            this.$store.commit('setAvator', '/images/icon.jpg');
                            this.$router.push({
                                name: 'home_index' 
                            });
                        }else{
                            this.$Message.error('用户名或者密码错误!');
                        }},
                        err => {
                            this.$Message.error('用户名或者密码错误!');
                            this.$refs.loginForm.resetFields();
                        })
                }
            });
        }
    }
};
</script>

<style>

</style>
