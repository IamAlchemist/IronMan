/**
 * Created by wizard on 10/18/16.
 */

const spider = require('../spider');
const expect = require("chai").expect;

const subSubjectURL = 'https://www.khanacademy.org/math/early-math/';
const classURL = 'https://www.khanacademy.org/math/early-math/cc-early-math-counting-topic';

describe("SnatchSubject", function() {
    describe("from url", function() {
        this.timeout(10000);

        it("early-math", function(done) {
            spider.snatchSubjectFromURL(subSubjectURL, function (items) {
                expect(items).to.have.length(8);
                done();
            });
        });
    });
});

describe("SnatchClass", function () {
    describe("from url", function() {
        this.timeout(15000);
        it("cc-early-math-counting-topic", function (done) {
            "use strict";
            spider.snatchClassFromURL(classURL, function (items) {
                expect(items).to.have.length(10);
                done();
            });
        });
    });
});