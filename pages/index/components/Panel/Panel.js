const connect = require('../../../../store/connect');

Component({
    behaviors: [
        connect(['counter']),
    ],
    data: {
        count: 0,
    },
    methods: {
        onStoreStateUpdate({ counter }) {
            this.setData({
                count: counter.count
            })
        }
    }
})
