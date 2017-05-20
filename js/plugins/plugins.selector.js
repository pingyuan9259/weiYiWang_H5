/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/2/10
 * @author: qiangkailiang
 */

$(".util-selector").on("click",'[data-role="selector"]' , function (e) {
    var selector=$(this).parent();
    e.stopPropagation();
    if (selector.hasClass('sSelector')){
        $(this).addClass('selected').siblings().removeClass('selected');
    }else if (selector.hasClass('mSelector')){
        $(this).toggleClass("selected");
    }
});