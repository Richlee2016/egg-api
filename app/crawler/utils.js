const reqPro = require("request-promise");

exports.reqPromise = async (opt) => {
    const options = Object.assign({}, opt, { json: true });
    try {
        const res = await reqPro(options);
        return res;
    } catch (err) {
        console.error(err)
    }
}