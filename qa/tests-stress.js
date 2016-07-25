/*We’ve already got our Mocha task configured in Grunt, so we should just be able to run
grunt , and see our new test passing (don’t forget to start your server in a separate window
first).*/

/*NOT WORKING --  HAVE TO FIXX*/


var loadtest = require('loadtest');
var expect = require('chai').expect;
suite('Stress tests', function(){
    test('Homepage should handle 100 requests in a second', function(done){
        var options = {
            url: 'http://localhost:3000',
            concurrency: 4,
            maxRequests: 100
        };
        loadtest.loadTest(options, function(err,result){
            expect(!err);
            expect(result.totalTimeSeconds < 1);
            done();
        });
    });
});

