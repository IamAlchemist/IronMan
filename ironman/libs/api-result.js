"use strict";

var errorMessages = [];

errorMessages[0] = '成功';
errorMessages[1] = '登录错误: 用户名或密码为空';
errorMessages[2] = '登录错误: 用户不存在！请先注册';
errorMessages[3] = '登录错误: 密码错误！';
errorMessages[4] = '注册错误: 必填项不能为空';
errorMessages[5] = '注册错误: 两次密码输入不一样';
errorMessages[6] = '注册错误: 用户已经存在';
errorMessages[7] = '注册错误: 保存用户错误';
errorMessages[8] = '需要重新登录';
errorMessages[9] = '绑定账户异常';
errorMessages[10] = '参数异常';

errorMessages[101] = '创建题目错误';
errorMessages[102] = '创建单词错误';
errorMessages[103] = '创建单词进度错误';
errorMessages[104] = '获取今日单词错误';
errorMessages[105] = '更新今日单词结果错误';
errorMessages[106] = '今日单词打卡失败';
errorMessages[107] = '获取今日单词结果失败';
errorMessages[108] = '获取打卡失败，账户是家长';
errorMessages[109] = 'inspection账户是学生';
errorMessages[110] = 'inspection每日获取失败';
errorMessages[111] = '未关联账号';
errorMessages[112] = '导入单词错误';
errorMessages[113] = '今日家庭作业打卡失败';
errorMessages[114] = '查询打卡数据异常';
errorMessages[115] = '查询打卡数据失败';
errorMessages[116] = '帐户应该是家长帐户';
errorMessages[117] = '帐户应该是学生帐户';
errorMessages[118] = '打卡失败';


function ApiResult(errorCode, content) {
    this.errorCode = errorCode;
    this.message = errorMessages[errorCode];
    this.content = content;
}


module.exports = ApiResult;