/**
 * @name:
 * @desc:文件/上传相关
 * @example:
 * @depend:
 * @date: 2017/1/22
 * @author: qiangkailiang
 */
common.getFileSize = function (target) {
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var fileSize = 0;
    if (isIE && !target.files) {
        //          var filePath = target.value;
        //          var fileSystem = new ActiveXObject("Scripting.FileSystemObject");   ／／IE需要安全配置
        //
        //          if(!fileSystem.FileExists(filePath)){
        //             alert("附件不存在，请重新输入！");
        //             return;
        //          }
        //          var file = fileSystem.GetFile (filePath);
        //          fileSize = file.Size;
    } else {
        fileSize = target.files[0].size;
    }

    return fileSize;
};

common.file = {};
common.file.getFileSize = function (target) {
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var fileSize = 0;
    if(target){
        if (isIE && !target.files) {
//            var filePath = target.value;
//            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
//
//            if(!fileSystem.FileExists(filePath)){
//               alert("附件不存在，请重新输入！");
//               return;
//            }
//            var file = fileSystem.GetFile (filePath);
//            fileSize = file.Size;
        } else {
            fileSize = target.files[0].size;
        }
    }
    return fileSize  ;
};

//获取文件名不包括后缀
common.file.getName = function (obj) {
    var path = obj//obj.val();
    var pos1 = path.lastIndexOf('/');
    var pos2 = path.lastIndexOf("\\");
    var pos3 = Math.max(pos1, pos2);
    var pos4 = path.lastIndexOf(".");
    var fileName = path.substring(pos3 + 1, pos4);
    var suffixName = path.substring(pos4 + 1, path.length);
    return {
        "fileName": fileName,   //文件名
        "suffixName": suffixName //文件后缀
    };
}