import injectDevServer from '@cypress/react/plugins/react-scripts';

const server = (on, config) => {
  injectDevServer(on, config);

  return config;
};

export default server;
