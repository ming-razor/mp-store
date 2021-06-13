const store = require("../../store/store");
const util = require("../../utils/util");
const connect = require('../../store/connect');

Component({
    behaviors: [
        connect(['counter']),
    ],
    data: {
        add_loading: false,
    },
    methods: {
        onStoreStateUpdate({ counter }) {
            this.setData({
                add_loading: counter.add_loading,
            });
        },
        onAdd() {
            store.dispatch({
                type: 'counter/add',
                payload: {
                    num: 1
                }
            });
        },
        onAsyncAdd() {
            if (this.data.add_loading) {
                return;
            }
            store.dispatch({
                type: 'counter/delayAdd',
            });
        }
    },
});
