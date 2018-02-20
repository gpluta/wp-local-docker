// plugins
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import changed from 'gulp-changed';
import cleancss from 'gulp-clean-css';
import concat from 'gulp-concat';
import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gutil from 'gulp-util';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourceMaps from 'gulp-sourcemaps';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import through from 'through2';
import uglify from 'gulp-uglify';

// config
import {paths} from './assets-tasks/config';
import {getEnv} from './assets-tasks/utils';

// scripts
import {compileScripts} from './assets-tasks/scripts';

const env = getEnv();

let cleanCss = cleancss;

const empty = () => { // Enables us to disable certain plugins in dev modes
    return through.obj((file, enc, cb) => {
        cb(null, file);
});
};

if (!(env.dist || env.prod)) {
    cleanCss = empty;
}

gulp.task('eslint', () =>
gulp.src(paths.src.allJs)
    .pipe(eslint())
    .pipe(eslint.format())
);

gulp.task('js', done => {
    compileScripts();
done();
});

// Concat and minify JS Includes
gulp.task('scripts-vendor', () => {
    if (paths.src.vendorJs.length) {
    return gulp.src(paths.src.vendorJs)
        .pipe(babel({
            presets: [
                ['@babel/env', {
                    'targets': {
                        'browsers': ['last 2 versions', 'safari >= 9']
                    }
                }]
            ],
            babelrc: false
        }))
        .pipe(uglify())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.dist.js));
}
});

// Compile scss
gulp.task('scss', () =>
gulp.src(paths.src.scss)
    .pipe(plumber(function (error) {
        gutil.log(gutil.colors.red(error.message));
        this.emit('end');
    }))
    .pipe(sourceMaps.init())
    .pipe(sass({
        errLogToConsole: true,
        includePaths: [
            './node_modules/foundation-sites/scss'
        ]
    }))
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(cleanCss())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(paths.dist.css))
);

gulp.task('imagemin', () =>
gulp.src(paths.src.images)
    .pipe(changed(paths.dist.images))
    .pipe(imagemin([
        imagemin.gifsicle({
            interlaced: true
        }),
        imagemin.jpegtran({
            progressive: true
        }),
        imagemin.optipng({
            optimizationLevel: 5
        }),
        imagemin.svgo({
            plugins: [{
                convertPathData: {
                    floatPrecision: 2
                }
            }]
        })
    ]))
    .pipe(gulp.dest(paths.dist.images))
);

gulp.task('imagemin', () =>
gulp.src(paths.src.images)
    .pipe(changed(paths.dist.images))
    .pipe(imagemin([
        imagemin.gifsicle({
            interlaced: true
        }),
        imagemin.jpegtran({
            progressive: true
        }),
        imagemin.optipng({
            optimizationLevel: 5
        }),
        imagemin.svgo({
            plugins: [{
                convertPathData: {
                    floatPrecision: 2
                }
            }]
        })
    ]))
    .pipe(gulp.dest(paths.dist.images))
);

// Buld an svg sprite to be inlined in index.php later
gulp.task('svg-sprite', () =>
gulp.src([paths.src.svg])
    .pipe(svgo({
        plugins: [
            {
                removeTitle: true
            }, {
                convertPathData: {
                    floatPrecision: 1
                }
            }
        ]
    }))
    .pipe(rename({prefix: 'image-'}))
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename({basename: 'inline-svgsprite', extname: '.php'}))
    .pipe(gulp.dest(paths.dist.images))
);

// Clean statics in dist folder
gulp.task('clean-statics', done => {
    del([paths.dist.statics]).then(paths => {
    console.log('Deleted: files and folders:\n', paths.join('\n'));
});
done();
});

// Copy all files from statics folder
gulp.task('copy-statics', () =>
gulp.src(paths.src.statics)
    .pipe(gulp.dest(paths.dist.statics))
);

gulp.task('clean', done => {
    del([paths.dist.base + '/**', '!' + paths.dist.base], '!' + paths.dist.base + '/.gitkeep')
.then(paths => {
    console.log('Deleted: files and folders:\n', paths.join('\n'));
done();
});
});

gulp.task('watch', () => {
    gulp.watch(paths.src.allJs, gulp.parallel('eslint', 'js'));
gulp.watch(paths.src.scss, gulp.parallel('scss'));
gulp.watch(paths.src.images, gulp.parallel('imagemin'));
gulp.watch(paths.src.statics, gulp.series('clean-statics', 'copy-statics'));
gulp.watch(paths.src.svg, gulp.series('svg-sprite'));
});

gulp.task('dist', gulp.series('clean', gulp.parallel('eslint', 'js', 'scss', 'scripts-vendor', 'imagemin', 'svg-sprite')));

gulp.task('default', gulp.series('watch'));
