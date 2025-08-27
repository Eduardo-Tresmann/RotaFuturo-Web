
import type { NextConfig } from 'next';
import type { RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: '50mb', 
  },
  webpack(config, { isServer }) {
    const fileLoaderRule = config.module.rules.find((rule: RuleSetRule) => {
      return rule.test instanceof RegExp && rule.test.test('.svg');
    });

    if (fileLoaderRule) {
      (fileLoaderRule as RuleSetRule).exclude = /\.svg$/;
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {},
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
