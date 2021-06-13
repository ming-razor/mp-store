module.exports = function (models) {
    const events = {};
    const all_effects = {};
    const all_reducers = {};
    const storeState = {};

    function publish(event_name) {
        const callbacks = events[event_name] || [];
        for (let callback of callbacks) {
            callback(storeState);
        };
    }
    
    function dispatch({ type, payload }) {
        const [model_name, method] = type.split('/');
        if (!all_reducers[model_name]) {
            console.warn(`不存在 model：${model_name}`);
        }
        const reducer_fn = all_reducers[model_name][method];
        const effect_fn = all_effects[model_name][method];
        if (reducer_fn) {
            const new_model_state = reducer_fn(storeState[model_name], { type, payload });
            storeState[model_name] = new_model_state;
            publish(model_name);
            return new_model_state;
        }
        if (effect_fn) {
            return effect_fn(
                { type, payload },
                { dispatch, storeState }
            );
        }
    }

    Object.keys(models).forEach(model_name => {
        events[model_name] = [];
        storeState[model_name] = models[model_name].state;
        all_effects[model_name] = models[model_name].effects || {};
        all_reducers[model_name] = models[model_name].reducers || {};
    });
    

    return {
        state: storeState,
        dispatch,
        subscribe(subscribeModelNames, subscribeCallback) {
            for (let subscribeModelName of subscribeModelNames) {
                if (events[subscribeModelName]) {
                    if (!events[subscribeModelName].includes(subscribeCallback)) {
                        events[subscribeModelName].push(subscribeCallback);
                    }
                }
            };
            subscribeCallback(storeState);
        },
        unsubscribe(subscribeCallback) {
            Object.keys(events).forEach(_eventName => {
                const callbacks = events[_eventName];
                events[_eventName] = callbacks.filter(callback => {
                    return callback !== subscribeCallback;
                });
            });
        }
    }
}