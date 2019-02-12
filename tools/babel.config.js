//  Imports

//  Exports
module.exports = function(api) {
  //  Cache   =====================================
  api.cache(() => process.env.NODE_ENV === 'production');

  //  Presets =====================================
  const env = [
    '@babel/preset-env',
    {
      targets: '> 0.25%, not dead',
      modules: false,
      loose: true,
      useBuiltIns: 'usage',
    },
  ];

  const flow = ['@babel/preset-flow'];

  //  Plugins =====================================

  //  Return =====================================
  const presets = [env, flow];
  const plugins = [];
  return {presets, plugins};
};
