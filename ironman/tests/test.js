'use strict';
const ApiResult = require('../libs/api-result');

const expect = require('chai').expect;
describe('test api result', function () {
    it('toString', function () {
        const result = new ApiResult(7, {error: "error"});
        console.log(JSON.stringify(result));
        expect(result.errorCode).eq(7);
    });

});