const srcBase = './assets-src';
const THEME_NAME = 'my-theme';

// Set the dir for your theme
let distBase = `./wordpress/wp-content/themes/${THEME_NAME}/assets`;

if (distBase === './wordpress/wp-content/themes/testtheme/assets') {
  console.log('Remember to setup the dir for your theme!')
}

const paths = {
  src: {
    base: srcBase,
    images: srcBase + '/images/**/*.{jpg,png,gif,svg}',
    svg: srcBase + '/svg/**/*.svg',
    scss: srcBase + '/scss/**/*.scss',
    ts: srcBase + '/ts/app.ts',
    js: srcBase + '/js/index.js',
    allTs: srcBase + '/ts/**/*.ts',
    allJs: srcBase + '/js/**/*.js',
    statics: srcBase + '/statics/**/*',

    // This is a list of js files that will be concatenated and saved as vendor.js file.
    // For stuff that can not be imported into the project with `import`...
    vendorJs: [
      './node_modules/foundation-sites/js/foundation.abide.js',
      './node_modules/foundation-sites/js/foundation.core.js'
    ]
  },
  dist: {
    base: distBase,
    images: distBase + '/images/',
    css: distBase + '/css/',
    js: distBase + '/js/',
    statics: distBase + '/statics/'
  }
};

// BEcause .babelrc in root dir is just so we can use gulp with es6...
const babelConfig = {
  presets: [['@babel/env', {
    targets: {
      browsers: ['last 2 versions', 'safari >= 9']
    },
    modules: false
  }]],
  babelrc: false,
  exclude: 'node_modules/**'
};

export {paths, babelConfig};
