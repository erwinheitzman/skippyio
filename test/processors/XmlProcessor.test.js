const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const xmlProcessorStub = {
    '../Results': {
        get: sinon.stub().returns([
            'C:/dev/temp_repo/results/results_01.xml',
            'C:/dev/temp_repo/results/results_02.xml',
            'C:/dev/temp_repo/results/results_03.xml',
            'C:/dev/temp_repo/results/results_04.xml'
        ])
    },
    'fs': {
        readFileSync: sinon.stub().returns(
            '<testsuites>'
            + '  <testsuite tests="3">'
            + '    <testcase classname="foo1" name="ASuccessfulTest"/>'
            + '    <testcase classname="foo2" name="AnotherSuccessfulTest"/>'
            + '    <testcase classname="foo3" name="AFailingTest">'
            + '      <failure type="NotEnoughFoo"> details about failure </failure>'
            + '    </testcase>'
            + '    <testcase classname="foo3" name="AFailingTest">'
            + '      <failure type="NotEnoughFoo"> details about failure </failure>'
            + '    </testcase>'
            + '    <testcase classname="foo89" name="21598 - AFailingTest">'
            + '      <failure type="NotEnoughFoozst"> details about failure </failure>'
            + '    </testcase>'
            + '    <testcase classname="foo89" name="21598 - AFailingTest">'
            + '      <failure type="NotEnoughFoozst"> details about failure </failure>'
            + '    </testcase>'
            + '    <testcase classname="foo89" name="21598 - AFailingTest">'
            + '      <failure type="NotEnoughFoozst"> details about failure </failure>'
            + '    </testcase>'
            + '    <testcase classname="foo90" name="21598 - AFailingTest">'
            + '      <failure type="NotEnoughFoozst"> details about failure </failure>'
            + '    </testcase>'
            + '  </testsuite>'
            + '</testsuites>'
        )
    }
};

describe('xmlProcessor.processFiles', () => {
    it('should return an object containing the only the failed tests and the times they failed', () => {
        const xmlProcessor = proxyquire.noCallThru()
            .load('../../lib/processors/XmlProcessor', xmlProcessorStub);

        const actual = xmlProcessor.processFiles();
        const expected = {
            'foo3 - AFailingTest': { failed: 8 },
            'foo89 - 21598 - AFailingTest': { failed: 12 },
            'foo90 - 21598 - AFailingTest': { failed: 4 }
        };
console.log('actual: ', actual);

        assert.deepEqual(actual, expected);
    });
});
