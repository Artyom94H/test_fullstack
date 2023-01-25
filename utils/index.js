
const emitTimeout = async (timeout = 1000) => {
  await (new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  }));
};

module.exports = {
  emitTimeout,
};
