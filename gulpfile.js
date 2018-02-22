var gulp = require('gulp'),
    merge = require("merge-stream"),
    browserify = require('browserify'),
    gulpBrowserify = require('gulp-browserify'),
    // browserify=require('b')
    gulpTs = require('gulp-typescript'),
    babel = require('babelify'),
    source = require('vinyl-source-stream'),
    dist = 'dist',
    dist_index = 'dist_index'

gulp.task(dist, function () {
    var gt = gulpTs.createProject('./.vscode/tsconfig.json')//outDir:'./'+dist_xb,
    return gulp.src('./**/*.ts').pipe(gt()).pipe(gulp.dest(`./${dist}`))
})
gulp.task("dist_index", [dist], function () {//{transform:["babel-core"]}
    var bundler = browserify(`./${dist}/index.js`).transform(babel);
    var index = bundler.bundle()
        .on('error', function (err) { console.error(err); this.emit('end'); })
        .pipe(source(`index.js`)).pipe(gulp.dest(`./${dist_index}`));
    var history= browserify(`./${dist}/HistoryRecord.js`).transform(babel).bundle()
    .on('error', function (err) { console.error(err); this.emit('end'); })
    .pipe(source(`HistoryRecord.js`)).pipe(gulp.dest(`./${dist_index}`));
    var html = gulp.src(['./*.html', './config.json', './web.config']).pipe(gulp.dest(`./${dist_index}`))
    var content = gulp.src(['./node_modules/vincijs/content/**/*']).pipe(gulp.dest(`./${dist_index}/content/`))
    return merge(index,history, html,content);
})
