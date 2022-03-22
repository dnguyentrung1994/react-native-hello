import 'dotenv/config';

export default ({ config }) => {
  const BaseURL =
    process.env.BUILD_MODE === 'development'
      ? process.env.BASE_URL_DEVELOPMENT
      : process.env.BUILD_MODE === 'production'
      ? process.env.BASE_URL_PRODUCTION
      : '';

  const Port =
    process.env.BUILD_MODE === 'development'
      ? process.env.DEVELOPMENT_PORT
      : process.env.BUILD_MODE === 'production'
      ? process.env.PRODUCTION_PORT
      : '';
  const SocketPort = process.env.SOCKET_PORT;
  return {
    ...config,
    extra: {
      baseURL: `${BaseURL}:${Port}`,
      socketURL: `${BaseURL}:${SocketPort}`,
    },
  };
};
