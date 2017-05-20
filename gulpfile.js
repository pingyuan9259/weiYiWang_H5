/**
 * Created by qiangkailiang on 2017/1/6.
 */
var gulp = require('gulp');
var concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    pump = require("pump"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    browserSync=require("browser-sync").create(),
    cleancss = require("gulp-clean-css");

gulp.task('bs', function() {
    var files = ['pages/**/*.html', 'design-html/**/*.html', 'css/**/*','js/**/*'];
    browserSync.init(files, {
        server: {
            baseDir: ""
        }
    });
});
gulp.task("sass", function () {
    return gulp.src("scss/**/*.scss").pipe(sass({style: "expanded"}))
    //     .pipe(cleancss({
    //     advanced: false,
    //     compatibility: 'ie8',
    //     keepBreaks: false,
    //     keepSpecialComments: '*'
    // }))
        .pipe(autoprefixer({
        browsers: ['Android >= 3.5', 'last 4 versions', 'ie >= 8', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 6', 'opera >= 12.1', 'ios >= 6', 'bb >= 10'],
        cascode: true
    })).pipe(gulp.dest("css/"));
});
gulp.task('concat', function (cb) {
    pump([
        gulp.src([
            'js/common/commonMain.js',
            'js/common/commonPrototype.js',
            'js/common/commonString.js',
            'js/common/commonCompatibility.js',
            'js/common/commonTips.js',
            'js/common/commonNet.js',
            'js/common/commonFile.js',
            'js/common/commonDate.js'
        ]),
        //uglify(),
        concat('/common.js'),
        gulp.dest('js')
    ], cb);
});
gulp.task("watch", function () {
    gulp.watch("js/common/*.js", ['concat']);
    gulp.watch("scss/**/*.scss", ['sass']);
});

