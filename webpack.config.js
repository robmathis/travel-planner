// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.devServer = {
    ...config.devServer,
    https: true,      // serve over HTTPS
    proxy: {
      // Proxy REST calls
      '/rest/v1': {
        target: 'https://sfeglrqwntdlalwllnrh.supabase.co',
        changeOrigin: true,
        secure: false,
      },
      // Proxy Auth calls
      '/auth/v1': {
        target: 'https://sfeglrqwntdlalwllnrh.supabase.co',
        changeOrigin: true,
        secure: false,
      },
      // (Optional) Proxy Storage
      '/storage/v1': {
        target: 'https://sfeglrqwntdlalwllnrh.supabase.co',
        changeOrigin: true,
        secure: false,
      },
    },
  };

  return config;
};

