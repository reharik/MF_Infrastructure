/**
 * Created by rharik on 7/8/15.
 */
var demand = require('must');


describe('repositoryTester', function() {
    var bootstrap;
    var Mut;
    var mut;
    var uuid;
    var EventData;
    var TestAgg;
    var testAgg;

    before( function () {
        bootstrap = require('../bootstrap');

    });

    beforeEach(function () {
        Mut = bootstrap.getInstanceOf('gesRepository');
        uuid = bootstrap.getInstanceOf('uuid');
        EventData = bootstrap.getInstanceOf('EventData');
        TestAgg = bootstrap.getInstanceOf('TestAgg');
        mut = new Mut();

    });

    context('when saving agg for first time', ()=> {
        it('should save agg with all events', async ()=> {
            testAgg = new TestAgg();
            testAgg.someCommand({value:'something Really important!'});
            testAgg.someCommand({value:'not wait. I mean something REALLY important!'});
            await mut.save(testAgg,null,{metametadata:'data'});
            //setInterval(async function(){
                var agg = await mut.getById(TestAgg,testAgg._id,1);
                console.log(agg);
                agg._version.must.equal(2);
        //},1000, this)
        });
    });
});