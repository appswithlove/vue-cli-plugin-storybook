const semver = require('semver');

// eslint-disable-next-line no-unused-vars
module.exports = (api, options, rootOptions) => {
  api.assertCliVersion('>=4');

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const pkg = require(api.resolve('package.json'));

  const params = {
    hasTS: api.hasPlugin('typescript'), // TODO: Typescript support
    hasBabel: api.hasPlugin('babel'),
    hasEslintPluginImport: !!pkg.devDependencies['eslint-plugin-import'],
    csf: options.csf || false,
    docs: options.docs || false,
    is_5_3: !semver.gtr('5.3.0', options.semver),
    is_6_0: !semver.gtr('6.0.0', options.semver),
  };

  // All versions need this
  api.extendPackage({
    scripts: {
      'storybook:serve': 'vue-cli-service storybook:serve -p 6006 -c config/storybook',
      'storybook:build': 'vue-cli-service storybook:build -c config/storybook',
    },
    devDependencies: {
      '@storybook/vue': options.semver,
    },
  });

  if (!params.is_6_0) {
    api.extendPackage({
      devDependencies: {
        '@storybook/addon-actions': options.semver,
        '@storybook/addon-knobs': options.semver,
        '@storybook/addon-links': options.semver,
        '@storybook/core': options.semver,
      },
    });
    if (params.docs) {
      api.extendPackage({
        devDependencies: {
          '@storybook/addon-docs': options.semver,
        },
      });
    }
  } else {
    // is 6.0+
    api.extendPackage({
      devDependencies: {
        '@storybook/addon-essentials': options.semver,
      },
    });
  }

  if (!params.hasBabel) {
    api.extendPackage({
      devDependencies: {
        '@babel/core': '^7.4.5',
        'babel-loader': '^8.0.4',
      },
    });
  }

  api.render('./template', params);
};
