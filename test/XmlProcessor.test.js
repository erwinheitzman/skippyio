const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const Results = proxyquire.noCallThru().load('../lib/Results', {
    get: sinon.stub().returns([
        'C:/dev/temp_repo/results/results_01.xml',
        'C:/dev/temp_repo/results/results_02.xml',
        'C:/dev/temp_repo/results/results_03.xml',
        'C:/dev/temp_repo/results/results_04.xml'
    ])
});

const XmlProcessorStub = {
    Results: Results,
    fs: {
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
            + '  </testsuite>'
            + '</testsuites>'
        )
    }
};

describe('XmlProcessor.processFiles', () => {
    it('should return an object containing the only the failed tests and the times they failed', () => {
        const XmlProcessor = proxyquire.noCallThru()
            .load('../lib/XmlProcessor', XmlProcessorStub);

        expect(XmlProcessor.processFiles()).to.deep.equal({
            'AFailingTest': { failed: 8 },
            '21598 - AFailingTest': { failed: 12 }
        });
    });
});
