module.exports = (message, status, name) => {
  const err = new Error(message);

  if (!!status) {
    err.status = status;
  }

  if (!!name) {
    err.name = name;
  }

  return err;
};
