process.env.CHROME_BIN = '/usr/bin/brave';

module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-webpack'),
    ],
    files: [
      { pattern: 'src/**/*.spec.jsx', watched: false },
      { pattern: 'src/**/*.spec.js', watched: false },
    ],
    preprocessors: {
      'src/**/*.spec.jsx': ['webpack'],
      'src/**/*.spec.js': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['.js', '.jsx'],
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '120' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
              },
            },
          },
          {
            test: /\.css$/,
            use: 'null-loader',
          },
        ],
      },
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    reporters: ['progress'],
  });
};
