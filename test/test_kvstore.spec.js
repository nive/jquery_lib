'use strict';
describe('jqKvStore', function() {

    var RESOURCE = 'mocks',
        RESOURCE_KEY = 'key',

        // some mock data
        mocks = [
            {
                key: RESOURCE_KEY+"1",
                value: 'first stored note ever!',
                id: 1,
                timestamp: 1414747731.52867
            },
            {
                key: RESOURCE_KEY+"2",
                value: 'yet another note',
                id: 2,
                timestamp: 1414747731.52834
            }
        ];

    var kvStore;

    beforeEach(function() {
        kvStore = new nive.KvStore({service: RESOURCE});
    });

    it('new instance', function() {
        var instance = new nive.KvStore({service: RESOURCE});
        expect(instance.options('service')).toEqual(RESOURCE);

        instance = new nive.KvStore(RESOURCE);
        expect(instance.options('service')).toEqual(RESOURCE);

        instance = new nive.KvStore({service: RESOURCE, token: '123456'});
        expect(instance.options('token')).toEqual('123456');
    });

    it('should exist', function() {
        expect(kvStore).toBeDefined();
    });

    it('should create a new item', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            params = $.parseJSON(params.data);
            var defer = $.Deferred();
            defer.resolve({result: 1, success: [params.items.key]});
            return defer.promise();
        });

        kvStore.newItem({items: {key: RESOURCE_KEY, value: 'some text'}}).done(function(response) {
            result = response;
        });

        expect(result.success[0]).toEqual(RESOURCE_KEY);
    });

    it('should create multiple new items', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            params = $.parseJSON(params.data);
            var defer = $.Deferred();
            defer.resolve({result: 2, success: [params.items[0].key, params.items[1].key]});
            return defer.promise();
        });

        kvStore.newItem({items: [{key: RESOURCE_KEY+"4", value: 'some text'},
                                 {key: RESOURCE_KEY+"5", value: 12345}]}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toEqual(2);
        expect(result.success[0]).toEqual(RESOURCE_KEY+"4");
        expect(result.success[1]).toEqual(RESOURCE_KEY+"5");
    });

    it('should create a new item and map param', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            params = $.parseJSON(params.data);
            expect(params.items.length).toEqual(2);
            var defer = $.Deferred();
            defer.resolve({result: 2, success: [params.items[0].key, params.items[1].key]});
            return defer.promise();
        });

        kvStore.newItem([{key: RESOURCE_KEY+"4", value: 'some text'},
                         {key: RESOURCE_KEY+"5", value: 12345}]).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toEqual(2);
        expect(result.success[0]).toEqual(RESOURCE_KEY+"4");
        expect(result.success[1]).toEqual(RESOURCE_KEY+"5");
    });

    it('should get a item', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve(mocks[0]);
            return defer.promise();
        });

        kvStore.getItem({key: RESOURCE_KEY+"1"}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.key).toEqual(RESOURCE_KEY+"1");
        expect(result.value).toEqual(mocks[0].value);
    });

    it('should get a item and map param', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            params = $.parseJSON(params.data);
            expect(params.key).toEqual(RESOURCE_KEY+"1");
            var defer = $.Deferred();
            defer.resolve(mocks[0]);
            return defer.promise();
        });

        kvStore.getItem(RESOURCE_KEY+"1").done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.key).toEqual(RESOURCE_KEY+"1");
        expect(result.value).toEqual(mocks[0].value);
    });

    it('should update a item', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            params = $.parseJSON(params.data);
            var defer = $.Deferred();
            defer.resolve({result: 1, success: [params.items.key]});
            return defer.promise();
        });

        kvStore.setItem({items: {key: RESOURCE_KEY+"1", value: 'some text'}}).done(function(response) {
            result = response;
        });


        expect(result.success[0]).toEqual(RESOURCE_KEY+"1");
    });

    it('should update multiple items', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            params = $.parseJSON(params.data);
            var defer = $.Deferred();
            defer.resolve({result: 2, success: [params.items[0].key, params.items[1].key]});
            return defer.promise();
        });

        kvStore.setItem({items: [{key: RESOURCE_KEY+"1", value: 'some text'},
                                 {key: RESOURCE_KEY+"2", value: 12345}]}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toEqual(2);
        expect(result.success[0]).toEqual(RESOURCE_KEY+"1");
        expect(result.success[1]).toEqual(RESOURCE_KEY+"2");
    });

    it('should update items and map param', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            params = $.parseJSON(params.data);
            expect(params.items.length).toEqual(2);
            var defer = $.Deferred();
            defer.resolve({result: 2, success: [params.items[0].key, params.items[1].key]});
            return defer.promise();
        });

        kvStore.setItem([{key: RESOURCE_KEY+"1", value: 'some text'},
                         {key: RESOURCE_KEY+"2", value: 12345}]).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toEqual(2);
        expect(result.success[0]).toEqual(RESOURCE_KEY+"1");
        expect(result.success[1]).toEqual(RESOURCE_KEY+"2");
    });

    it('should remove a item', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            params = $.parseJSON(params.data);
            var defer = $.Deferred();
            defer.resolve({result: 1, success: [params.keys]});
            return defer.promise();
        });

        kvStore.removeItem({key: RESOURCE_KEY+"1"}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toEqual(1);
    });

    it('should remove a item and map param', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            params = $.parseJSON(params.data);
            expect(params.key).not.toBeNull();
            var defer = $.Deferred();
            defer.resolve({result: 1, success: [params.keys]});
            return defer.promise();
        });

        kvStore.removeItem(RESOURCE_KEY+"1").done(function(response) {
            result = response;
        });



        expect(result).not.toBeNull();
        expect(result.result).toEqual(1);
    });

    it('should list stored items', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({total: 1, items: mocks});
            return defer.promise();
        });

        kvStore.list().done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.items.length).toEqual(mocks.length);
    });

    it('should list stored keys', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({keys: [RESOURCE_KEY]});
            return defer.promise();
        });

        kvStore.keys().done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.keys.length).toEqual(1);
        expect(result.keys[0]).toEqual(RESOURCE_KEY);
    });

    it('should show access allowed', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({removeItem: true});
            return defer.promise();
        });

        kvStore.allowed({permission: 'removeItem'}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result['removeItem']).toBeTruthy();
    });

    it('should show multiple access allowed', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({removeItem: false, update: true});
            return defer.promise();
        });

        kvStore.allowed({permission: ['removeItem', 'update']}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result['removeItem']).toBeFalsy();
        expect(result['update']).toBeTruthy();
    });

    it('should show permissions', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve([['newItem', ['sys:authenticated']], ['getItem', ['sys:owner','admins']]]);
            return defer.promise();
        });

        kvStore.getPermissions({}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.length).toBeTruthy();
    });

    it('should set permissions', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        kvStore.setPermissions({permissions: {permission: 'newItem', group: 'sys:owner'}}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

    it('should set multiple permissions', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        kvStore.setPermissions({permissions: [{permission: 'newItem', group: 'sys:owner'},
                                              {permission: 'getItem', group: 'sys:owner'}]}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

    it('should set permissions revoke', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        kvStore.setPermissions({permissions: {permission: 'newItem', group: 'sys:owner', action: 'revoke'}}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

    it('should fail to set permissions', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, message: 'unknown_permission'});
            return defer.promise();
        });

        kvStore.setPermissions({permissions: {permission: 'whatever', group: 'sys:owner'}}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toBeFalsy();
        expect(result.message).toBeDefined();
    });

    it('should show owner', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({owner: 'Test'});
            return defer.promise();
        });

        kvStore.getOwner({key: RESOURCE_KEY}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.owner).toEqual('Test');
    });

    it('should set owner', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        kvStore.setOwner({key: RESOURCE_KEY, owner: 'Test 1'}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

    it('should fail to set owner', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, message: 'unknown_user'});
            return defer.promise();
        });

        kvStore.setOwner({key: RESOURCE_KEY, owner: 'whatever'}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toBeFalsy();
        expect(result.message).toBeDefined();
    });

    it('should call ping', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: 1});
            return defer.promise();
        });

        kvStore.ping().done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });    
});