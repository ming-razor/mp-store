const util = require('../../utils/util');

module.exports = {
    /* 
        状态管理-数据
    */
    state: {
        count: 0,
        add_loading: false,
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
            })
            
        }
    },
    /*
        同步方法- return 的结果会覆盖此 model的 state
    */
    reducers: {
        add(state, { payload }) {
            return {
                ...state,
                count: state.count + payload.num
            }
        },
        setAddLoading(state, { payload }) {
            return {
                ...state,
                add_loading: payload
            }
        }
    }
};