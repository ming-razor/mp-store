const store = require('./store');

module.exports = function (emitModels) {
    return Behavior({
        options: {
            pureDataPattern: /^_store_/ // 指定所有 _store_ 开头的数据字段为纯数据字段
        },

        data: {
            _store_emited: false,
        },
        lifetimes: {
            created() {
                this.onStoreStateUpdate = this.onStoreStateUpdate.bind(this);
            },
            attached() {

                if (!this.data._store_emited) {
                    this.data._store_emited = true;
                    store.subscribe(emitModels, this.onStoreStateUpdate);
                }
            },
            detached() {
                this.data._store_emited = false;
                store.unsubscribe(this.onStoreStateUpdate);
            },
        },

        pageLifetimes: {
            show() {
                if (!this.data._store_emited) {
                    this.data._store_emited = true;
                    store.subscribe(emitModels, this.onStoreStateUpdate);
                }
            },
            hide() {
                this.data._store_emited = false;
                store.unsubscribe(this.onStoreStateUpdate);
            },
        },

        methods: {
            onStoreStateUpdate(storeState) {
                console.log('onStoreStateUpdate 方法需要被覆盖');
            }
        }
    });
};