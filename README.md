# 微信小程序状态管理
基于发布订阅模式、小程序自定义组件behaviors配置 实现数据的状态管理。  
> 详细使用可参考 [demo](https://github.com/ming-razor/mini_program_store_demo)
   
## 应用场景
原生微信小程序开发

## 解决问题和实现目的
- [x] 全局共享的状态管理
- [x] 组件与页面都可订阅状态
- [x] 按需订阅
- [x] 支持异步编程
- [x] 不依赖插件

## 如何使用
1. 创建model文件如 `store/models/counter.js`；类似dva的model 或 vue的module
```javascript
const util = require('../../utils/util');
module.exports = {
    /* 
        状态管理-数据
    */
    state: {
        count: 0
    },
    /* 
        异步方法: return 会返回给 dispatch()
    */
    effects: {
        delayAdd(action, { dispatch, storeState }) {
           dispatch({
                type: 'counter/setAddLoading',
                payload: true
            });

            // 延迟 600ms
            return util.delay(600).then(() => {
                dispatch({
                    type: 'counter/setAddLoading',
                    payload: false
                });
                dispatch({
                    type: 'counter/add',
                    payload: {
                        num: 1,
                    }
                });
                return storeState.counter.count;
            })
        },
    },
    /*
        同步方法: return 会覆盖此 model的 state
    */
    reducers: {
        add(state, { payload }) {
            return {
                ...state,
                count: state.count + payload.num
            }
        }
    }
};
```

2. store中注入此model `store/store.js`
```javascript
const createStore = require('../utils/createStore');
const counter = require('./models/counter.js');

module.exports = createStore({
    counter,
});
```

3. 在页面或组件的js订阅需要的数据；页面与组件都使用 **Component 构造器**
```javascript
const store = require("../../store/store");
const connect = require('../../store/connect');

Component({
    /* 
        1. 这里选择需要订阅的数据。
            connect的参数: 模块名[]
    */
    behaviors: [
        connect(['counter']),
    ],
    data: {
        count: 0,
    },
    methods: {
        /*  
            1. 数据更新会触发 onStoreStateUpdate, 参数是 store 的 state
        */
        onStoreStateUpdate({ counter }) {
            this.setData({
                count: counter.count
            });
        },
        onAdd() {
            /* 
                触发数据变更
            */
            store.dispatch({
                type: 'counter/add',
                payload: {
                    num: 1
                }
            });
        },
        onAsyncAdd() {
            /* 
                触发store的异步方法。一般方法内会再 dispatch 触发数据变更
            */
            store.dispatch({
                type: 'counter/delayAdd',
            });
        }
    }
});
```

## `store/store.js` 的属性
* store.state
  > * store的数据状态  
* store.dispatch({ type, payload })
  > * type: 字符串, **以/为分割符**；前面是model名，后面是方法名。 '[model name]/[method]'  
  > * payload 传给方法的参数
* store.subscribe(subscribeModelNames, subscribeCallback)
  > * subscribeModelNames: string[]  订阅的model  
  > * subscribeCallback: function()  订阅的model发布状态改变触发的回调  

## 必要文件的简单说明 
* utils/createStore.js 
  > 实现了js发布订阅。 解析model，创建store。
* store/store.js 
  > 具体的store对象。可用于获取所有数据(state); 触发状态改变(dispatch); 订阅与取消订阅(subscribe/unsubscribe)。
* store/connect.js 
  > connect方法用于接受需要订阅model，创建 behavior。 用于组件订阅
* store/models/* 
  > 数据模块管理文件



