import path from 'path';

const root = path.resolve(__dirname, '../');
const app = path.resolve(root, 'app');
const dist = path.resolve(root, 'dist');
const modules = path.resolve(root, 'node_modules');

export default {
  app,
  dist,
  modules
};
