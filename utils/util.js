
module.exports = {
    delay(stamp = 0) {
        return new Promise(reslove => {
            setTimeout(reslove, stamp);
        });
    },
};
