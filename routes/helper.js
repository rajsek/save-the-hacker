let lib = {};
lib.random = (low, high) => {
    return Math.floor(Math.random() * (high - low) + low);
}
module.exports = lib;
