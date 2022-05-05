const Credentials = () => {
  return {
    REACT_APP_CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
    REACT_APP_CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET,
  };
};

export { Credentials };
