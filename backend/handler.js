exports.handler = (event, context, callback) => {
  // eslint-disable-next-line no-param-reassign
  event.response.autoConfirmUser = true;
  callback(null, event);
};
