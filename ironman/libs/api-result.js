"use strict";

var errorMessages = [];

errorMessages[0]='成功';
errorMessages[1]='登录错误: 用户名或密码为空';
errorMessages[2]="用户不存在！请先注册";
errorMessages[3]='密码错误！';


function ApiResult(errorCode, content) {
    return {
        errorCode,
        message: errorMessages[errorCode],
        content
    };
}


module.exports = ApiResult;