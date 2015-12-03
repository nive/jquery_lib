'use strict';
describe('endpoint', function() {

    it('fnc should exist', function() {
        expect(nive.endpoint).toBeDefined();
    });

    it('excp should exist', function() {
        expect(nive.endpoint.EndpointException).toBeDefined();
    });

    it('make url root', function() {
        var url = nive.endpoint.makeUrl({service: 'test'});
        expect(url).toEqual('/test/api');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain'});
        expect(url).toEqual('https://testdomain.nive.io/test/api');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain.com'});
        expect(url).toEqual('https://testdomain.com/test/api');
    });

    it('make url method', function() {
        var url = nive.endpoint.makeUrl({service: 'test', method: 'list'});
        expect(url).toEqual('/test/api/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain', method: 'list'});
        expect(url).toEqual('https://testdomain.nive.io/test/api/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain.com', method: 'list'});
        expect(url).toEqual('https://testdomain.com/test/api/list');
    });

    it('make url secure', function() {
        var url = nive.endpoint.makeUrl({service: 'test', secure: false});
        expect(url).toEqual('/test/api');

        url = nive.endpoint.makeUrl({service: 'test', method: 'list', secure: false});
        expect(url).toEqual('/test/api/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain', method: 'list', secure: false});
        expect(url).toEqual('http://testdomain.nive.io/test/api/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain.com', method: 'list', secure: false});
        expect(url).toEqual('http://testdomain.com/test/api/list');
    });

    it('make url api version', function() {
        var url = nive.endpoint.makeUrl({service: 'test', version: 'api2.3'});
        expect(url).toEqual('/test/api2.3');

        url = nive.endpoint.makeUrl({service: 'test', method: 'list', version: 'api2.3'});
        expect(url).toEqual('/test/api2.3/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain', method: 'list', version: 'api2.3'});
        expect(url).toEqual('https://testdomain.nive.io/test/api2.3/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain.com', method: 'list', version: 'api2.3'});
        expect(url).toEqual('https://testdomain.com/test/api2.3/list');
    });

    it('make url path', function() {
        var url = nive.endpoint.makeUrl({service: 'test', path: 'to/here'});
        expect(url).toEqual('/test/api/to/here');

        url = nive.endpoint.makeUrl({service: 'test', path: 'to/here', method: 'list'});
        expect(url).toEqual('/test/api/to/here/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain', path: 'to/here', method: 'list'});
        expect(url).toEqual('https://testdomain.nive.io/test/api/to/here/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain.com', path: 'to/here', method: 'list', version: 'api2.3'});
        expect(url).toEqual('https://testdomain.com/test/api2.3/to/here/list');

        url = nive.endpoint.makeUrl({service: 'test', path: '/to/here'});
        expect(url).toEqual('/test/api/to/here');

        url = nive.endpoint.makeUrl({service: 'test', path: '/to/here', method: 'list'});
        expect(url).toEqual('/test/api/to/here/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain', path: '/to/here', method: 'list'});
        expect(url).toEqual('https://testdomain.nive.io/test/api/to/here/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain.com', path: '/to/here', method: 'list', version: 'api2.3'});
        expect(url).toEqual('https://testdomain.com/test/api2.3/to/here/list');
    });

    it('make extended url path', function() {
        var url = nive.endpoint.makeUrl({service: 'test', path: 'to/here'}, 'file1.txt');
        expect(url).toEqual('/test/api/to/here/file1.txt');

        url = nive.endpoint.makeUrl({service: 'test', path: 'to/here', method: 'list'}, 'file1.txt');
        expect(url).toEqual('/test/api/to/here/file1.txt/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain', path: 'to/here', method: 'list'}, 'file1.txt');
        expect(url).toEqual('https://testdomain.nive.io/test/api/to/here/file1.txt/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain.com', path: 'to/here', method: 'list', version: 'api2.3'}, 'file1.txt');
        expect(url).toEqual('https://testdomain.com/test/api2.3/to/here/file1.txt/list');

        url = nive.endpoint.makeUrl({service: 'test', path: '/to/here'}, 'file1.txt');
        expect(url).toEqual('/test/api/to/here/file1.txt');

        url = nive.endpoint.makeUrl({service: 'test', path: '/to/here', method: 'list'}, 'file1.txt');
        expect(url).toEqual('/test/api/to/here/file1.txt/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain', path: '/to/here', method: 'list'}, 'file1.txt');
        expect(url).toEqual('https://testdomain.nive.io/test/api/to/here/file1.txt/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain.com', path: '/to/here', method: 'list', version: 'api2.3'}, 'file1.txt');
        expect(url).toEqual('https://testdomain.com/test/api2.3/to/here/file1.txt/list');
    });

    it('make abs url path', function() {
        var url = nive.endpoint.makeUrl({service: 'test', path: 'to/here'}, '/file1.txt');
        expect(url).toEqual('/test/api/file1.txt');

        url = nive.endpoint.makeUrl({service: 'test', path: 'to/here', method: 'list'}, '/file1.txt');
        expect(url).toEqual('/test/api/file1.txt/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain', path: 'to/here', method: 'list'}, '/file1.txt');
        expect(url).toEqual('https://testdomain.nive.io/test/api/file1.txt/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain.com', path: 'to/here', method: 'list', version: 'api2.3'}, '/file1.txt');
        expect(url).toEqual('https://testdomain.com/test/api2.3/file1.txt/list');

        url = nive.endpoint.makeUrl({service: 'test', path: '/to/here'}, '/file1.txt');
        expect(url).toEqual('/test/api/file1.txt');

        url = nive.endpoint.makeUrl({service: 'test', path: '/to/here', method: 'list'}, '/file1.txt');
        expect(url).toEqual('/test/api/file1.txt/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain', path: '/to/here', method: 'list'}, '/file1.txt');
        expect(url).toEqual('https://testdomain.nive.io/test/api/file1.txt/list');

        url = nive.endpoint.makeUrl({service: 'test', domain: 'testdomain.com', path: '/to/here', method: 'list', version: 'api2.3'}, '/file1.txt');
        expect(url).toEqual('https://testdomain.com/test/api2.3/file1.txt/list');
    });

    it('make url relative path', function() {
        var url = nive.endpoint.makeUrl({path: '../relative/to/here'});
        expect(url).toEqual('../relative/to/here');

        url = nive.endpoint.makeUrl({path: '../relative/to/here', method: 'list'});
        expect(url).toEqual('../relative/to/here/list');

        url = nive.endpoint.makeUrl({path: '../relative/to/here', service: 'test', domain: 'testdomain', method: 'list'});
        expect(url).toEqual('../relative/to/here/list');

        url = nive.endpoint.makeUrl({path: '../relative/to/here', service: 'test', domain: 'testdomain.com', method: 'list', version: 'api2.3'});
        expect(url).toEqual('../relative/to/here/list');

        url = nive.endpoint.makeUrl({path: './relative/to/here'});
        expect(url).toEqual('./relative/to/here');

        url = nive.endpoint.makeUrl({path: './relative/to/here', method: 'list'});
        expect(url).toEqual('./relative/to/here/list');

        url = nive.endpoint.makeUrl({path: './relative/to/here', service: 'test', domain: 'testdomain', method: 'list'});
        expect(url).toEqual('./relative/to/here/list');

        url = nive.endpoint.makeUrl({path: './relative/to/here', service: 'test', domain: 'testdomain.com', method: 'list', version: 'api2.3'});
        expect(url).toEqual('./relative/to/here/list');
    });

});