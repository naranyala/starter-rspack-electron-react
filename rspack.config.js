const path = require('path');
const HtmlWebpackPlugin = require('@rspack/plugin-html').default;

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDev = !isProduction;

  return {
    mode: argv.mode || 'development',
    entry: {
      main: './src/index.tsx'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    tsx: true,
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                    },
                  },
                },
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'ecmascript',
                    jsx: true,
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                    },
                  },
                },
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? 
              { loader: require('mini-css-extract-plugin').loader } : 
              { loader: 'style-loader' },
            { loader: 'css-loader' },
          ],
          type: 'javascript/auto',
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]'
          }
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      ...(isProduction ? [
        new (require('mini-css-extract-plugin'))({
          filename: '[name].[contenthash].css',
        })
      ] : [])
    ],
    devServer: {
      port: 1234,
      hot: true,
      open: false, // Don't automatically open browser
    },
    target: isDev ? 'web' : 'electron-renderer', // Use web for dev server, electron-renderer for production
  };
};