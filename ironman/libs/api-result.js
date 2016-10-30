"use strict";

var errorMessages = [];

errorMessages[0]='成功';
errorMessages[1]='登录错误: 用户名或密码为空';
errorMessages[2]='登录错误: 用户不存在！请先注册';
errorMessages[3]='登录错误: 密码错误！';
errorMessages[4]='注册错误: 必填项不能为空';
errorMessages[5]='注册错误: 两次密码输入不一样';
errorMessages[6]='注册错误: 用户已经存在';
errorMessages[7]='注册错误: 保存用户错误';

errorMessages[101]='创建题目错误';


function ApiResult(errorCode, content) {
    this.errorCode = errorCode;
    this.message = errorMessages[errorCode];
    this.content = content;
}


module.exports = ApiResult;