import HtmlRspackPlugin from '@rspack/plugin-html';
import * as fs from 'fs';
import * as path from 'path';

interface RspackConfigArgs {
  mode?: 'development' | 'production';
}

// Get port from environment or config file
function getDevPort(): number {
  // First try environment variable
  if (process.env.DEV_SERVER_PORT) {
    return parseInt(process.env.DEV_SERVER_PORT, 10);
  }

  // Then try config file
  try {
    const configPath = path.join(__dirname, '.dev-port.json');
    if (fs.existsSync(configPath)) {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (data.port) return data.port;
    }
  } catch (e) {
    // Ignore errors
  }

  // Default fallback
  return 3000;
}

export default (env: any, argv: RspackConfigArgs) => {
  const isProduction = argv.mode === 'production';
  const isDev = !isProduction;
  const devPort = getDevPort();

  return {
    mode: argv.mode || 'development',
    entry: {
      main: './src/index.tsx',
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
      },
      modules: ['node_modules'],
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
            isProduction
              ? { loader: require('mini-css-extract-plugin').loader }
              : { loader: 'style-loader' },
            { loader: 'css-loader' },
          ],
          type: 'javascript/auto',
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new HtmlRspackPlugin({
        template: './src/index.html',
      }),

      ...(isProduction
        ? [
            new (require('mini-css-extract-plugin'))({
              filename: '[name].[contenthash].css',
            }),
          ]
        : []),
    ],
    devServer: {
      port: devPort,
      hot: true,
      open: false, // Don't automatically open browser
    },
    target: isDev ? 'web' : 'electron-renderer', // Use web for dev server, electron-renderer for production
  };
};
