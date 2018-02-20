import {paths, babelConfig as bc} from './config';
import {getEnv} from './utils';
import {rollup} from 'rollup';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const env = getEnv();

const compileScripts = async function () {
  const plugins = [
    resolve(),
    commonjs(),
    babel(bc)
  ];

  if (env.dist) {
    plugins.push(uglify());
  }

  const bundle = await rollup({
    input: paths.src.js,
    plugins
  });

  // console.log(bundle);

  await bundle.write({
    file: `${paths.dist.js}/scripts.js`,
    format: 'iife',
    name: 'myScripts',
    sourcemap: !(env.dist || env.prod)
  })
};

export {compileScripts}
