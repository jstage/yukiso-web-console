import axios from 'axios';
import env from '../../build/env';
import semver from 'semver';
import packjson from '../../package.json';

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
let util = {

};
util.mbean2=()=>'java.lang';
util.mbean = () => 'org.apache.activemq';
// util.mbean = () => 'com.apusic.amq';
function format(value) {
    this._value = value;
    this.toString = function () {
        return this._value;
    }
}
/**
 * 格式化函数
 * 1.判断空 非空显示原始数据 空值显示无
 * 2.布尔判断 true 为是 false 为否
 * 3.比较判断 不同为否 相同时看origin参数
        origin: 显示原始值 或直接显示否 默认false直接显示否
   4.时间格式化 依据给定的格式 格式化时间字符串 格式化默认为 yyyy-MM-dd mm:ss
 */
format.prototype.formatEmpty = function () {
    this._value = this._value ? this._value : '无';
    return this;
}
format.prototype.formatBoolean = function () {
    this._value = this._value ? '是' : '否';
    return this;
}
format.prototype.formatCompare = function (compare,origin1,origin2) {
    this._value = this._value === compare ? (origin1 ? origin1 : '是' ):(origin2 ? origin2 : '否' );
    return this;
}
format.prototype.formatCompareOrigin = function (compare) {
    this._value = this._value === compare ? '是' : '否';
    return this;
}
format.prototype.formatTime = function (reg) {
    reg = reg ? reg : 'yyyy-MM-dd hh:mm:ss';
    this._value = new Date(this._value).format(reg);
    return this;
}
util.formats = function (value) {
    return new format(value);
}
util.title = function (title) {
    title = title || '管理控制台';
    window.document.title = title;
};
function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return localhostPaht+projectName+'/jolokia';
}
//localhost
const ajaxUrl = env === 'development' ?
    'http://localhost:8161/console/jolokia' :
    env === 'production' ?
    getRootPath() :
    'https://debug.url.com';
// util.ajaxUrl = getRootPath();
util.ajaxUrl = 'http://localhost:8161/console/jolokia';
util.ajax = axios.create({
    baseURL:'http://localhost:8161/console/jolokia',
    // baseURL:getRootPath(),
    timeout: 30000
});
util.rootPath = 'http://localhost:8161/console/jolokia';
// util.rootPath = getRootPath();
util.ajax.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    var token = localStorage.JWT_TOKEN;
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
util.ajax.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    localStorage.JWT_TOKEN = '';
    return Promise.reject(error);
});
util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [{
            title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
            path: '',
            name: 'home_index'
        }];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [{
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [{
                title: '首页',
                path: '',
                name: 'home_index'
            }];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [{
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [{
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util.checkUpdate = function (vm) {
    // axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
    //     let version = res.data.tag_name;
    //     vm.$Notice.config({
    //         duration: 0
    //     });
    //     if (semver.lt(packjson.version, version)) {
    //         vm.$Notice.info({
    //             title: 'iview-admin更新啦',
    //             desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
    //         });
    //     }
    // });
};
// 返回对象
util.getBrokerName = function (vm) {
    let self = this;
    return new Promise((resolve, reject) => {
        self.ajax.post('', {
            "type": "read",
            "mbean": util.mbean() + ":type=Broker,brokerName=*"
        }).then(res => {
            Object.keys(res.data.value).forEach((key) => {
                let broker = res.data.value[key];
                resolve(broker);
                // console.log(res.data.value);
               //  console.log(broker);
            })
        },
        error => {
            vm.$store.commit("logout", vm);
            vm.$store.commit("clearOpenedSubmenu");
            vm.$router.push({
                name: "login",
            });
        });
    })
}
util.getMbeanNameAny = function(vm,request){
    let start = util.mbean();
    let self = this;
    return new Promise((resolve, reject) => {
        request.post('', {
            "type": "read",
            "mbean": start + ":type=Broker,brokerName=*"
        }).then(res => {
            // Object.keys(res.data.value).forEach((key) => {
            //    resolve({
            //     key:res.data.value[key]
            //    });
            //    //  console.log(res);
            //     // console.log(res.data.value);
            //     // console.log(key);
            // })
            resolve(res.data.value);
        },error => {
        });
    })
}
// 返回的是：com.apusic.amq:brokerName=Test,type=Broker
util.mbeanName = function (vm) {
    let start = util.mbean();
    let self = this;
    return new Promise((resolve, reject) => {
        self.ajax.post('', {
            "type": "read",
            "mbean": start + ":type=Broker,brokerName=*"
        }).then(res => {
            Object.keys(res.data.value).forEach((key) => {
               resolve(key);
               //  console.log(res);
                // console.log(res.data.value);
                // console.log(key);
            })
        },error => {
            vm.$store.commit("logout", vm);
            vm.$store.commit("clearOpenedSubmenu");
            vm.$router.push({
                name: "login",
            });
        });
    })
};
   
util.getNonHeapMemoryObj = function (vm) {
        let start = util.mbean2();
        let self = this;
        return new Promise((resolve, reject) => {
            self.ajax.post('', {
                "type": "read",
                "mbean": start + ":type=Memory"
            }).then(res => {
                Object.keys(res.data.value).forEach(key=>{
                    let NonHeapMemoryObj=res.data.value.NonHeapMemoryUsage;
                    resolve();
                    console.log(res);
                    console.log(NonHeapMemoryObj);                            
                })
            },error => {
                vm.$store.commit("logout", vm);
                vm.$store.commit("clearOpenedSubmenu");
                vm.$router.push({
                    name: "login",
                });
            });
        })
    };

    util.getHeapMemoryObj = function (vm) {
        let start = util.mbean2();
        let self = this;
        return new Promise((resolve, reject) => {
            self.ajax.post('', {
                "type": "read",
                "mbean": start + ":type=Memory"
            }).then(res => {
                Object.keys(res.data.value).forEach(key=>{
                    let HeapMemoryObj=res.data.value.HeapMemoryUsage;
                   // let MProperties=res.data.value[key];
                    resolve(HeapMemoryObj);
                   //console.log(HeapMemoryObj);                    
                //    console.log(res);
                }),error => {
                    vm.$store.commit("logout", vm);
                    vm.$store.commit("clearOpenedSubmenu");
                    vm.$router.push({
                        name: "login",
                    });
                }               
            });
        })
    };
    util.getThreading = function (vm) {
        let start = util.mbean2();
        let self = this;
        return new Promise((resolve, reject) => {
            self.ajax.post('', {
                "type": "read",
                "mbean": start + ":type=Threading"
            }).then(res => {
               let threadProperties=res.data.value;
             //  console.log(threadProperties.PeakThreadCount);
               resolve(threadProperties);
            },error => {
                vm.$store.commit("logout", vm);
                vm.$store.commit("clearOpenedSubmenu");
                vm.$router.push({
                    name: "login",
                });
            });
        })
    };
export default util;    