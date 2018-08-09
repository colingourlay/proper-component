import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.browser,
      name: 'properComponent',
      format: 'umd',
      globals: {
        react: 'React'
      }
    },
    plugins: [external(), buble(pkg.buble), resolve(), commonjs()]
  },
  {
    input: 'src/index.js',
    external: ['hoist-non-react-statics'],
    output: [{ file: pkg.main, format: 'cjs' }, { file: pkg.module, format: 'es' }],
    plugins: [external(), buble(pkg.buble)]
  }
];
