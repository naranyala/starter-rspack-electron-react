import * as path from 'path';
import HtmlRspackPlugin from '@rspack/plugin-html';
import * as fs from 'fs';

interface RspackConfig {
  mode: string;
  entry: string;
  output: {
    path: string;
    filename: string;
    clean: boolean;
  };
  resolve: {
    alias: Record<string, string>;
    extensions: string[];
  };
  module: {
    rules: Array<any>;
  };
  plugins: Array<any>;
  devServer: {
    port: number;
    hot: boolean;
    historyApiFallback: boolean;
  };
  target: string;
}

const config: RspackConfig = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/main': path.resolve(__dirname, 'src/main'),
      '@/renderer': path.resolve(__dirname, 'src/renderer'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
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
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
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
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
        type: 'javascript/auto',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlRspackPlugin({
      template: './src/index.html',
      favicon: './src/assets/favicon.ico',
    }),
    {
      apply: (compiler: any) => {
        compiler.hooks.afterEmit.tap('CopyAssetsPlugin', () => {
          // Copy icon assets to dist directory
          const assetsDir = path.join(__dirname, 'src', 'assets');
          const distDir = path.join(__dirname, 'dist');

          // Ensure dist directory exists
          if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
          }

          // Copy icon files
          const iconFiles = ['icon.png', 'icon.ico', 'icon.svg'];
          iconFiles.forEach(iconFile => {
            const srcPath = path.join(assetsDir, iconFile);
            const destPath = path.join(distDir, iconFile);
            if (fs.existsSync(srcPath)) {
              fs.copyFileSync(srcPath, destPath);
              console.log(`Copied ${srcPath} to ${destPath}`);
            }
          });
        });
      }
    }
  ],

  devServer: {
    port: 3000, // Changed to avoid port conflicts
    hot: true,
    historyApiFallback: true,
  },
  target: 'electron-renderer',
};

export default config;