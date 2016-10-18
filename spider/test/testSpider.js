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

        it("early-math", done => {
            spider.snatchSubjectFromURL(subSubjectURL, function (items) {
                expect(items).lengthOf(8);
                done();
            });
        });
    });
});

describe("SnatchClass", function () {
    describe("from url", function() {
        this.timeout(15000);
        it('cc-early-math-counting-topic', done => {
            spider.snatchClassFromURL(classURL, function (items) {
                expect(items).lengthOf(10);
                done();
            });
        });
    });
});