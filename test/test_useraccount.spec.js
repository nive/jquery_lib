'use strict';
describe('jqUser', function() {

    var user;

    beforeEach(function() {
        user = new nive.User();
    });

    it('new instance', function() {
        var instance = new nive.User();
        expect(instance.options('service')).toEqual('users');

        instance = new nive.User({'token': '123456'});
        expect(instance.options('token')).toEqual('123456');
    });

    it('should exist', function() {
        expect(user).toBeDefined();
    });

    it('get a security token', function() {
        var identity = 'TestIdentity',
            password = 'TEST',
            result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            params = $.parseJSON(params.data);

            if(identity === params.identity && params.password === password) {
                defer.resolve({token: "a-token"});
            } else {
                defer.resolve({token: null, message: 'Wrong credentials'});
            }
            return defer.promise();
        });

        // try sign up with wrong credentials
        user.token({identity: 'unknown', password: password}).then(function(response) {
            result = response;
        });

        expect(result.token).toBeNull();

        user.token({identity: identity, password: password}).then(function(response) {
            result = response;
        });

        expect(result.token).not.toBeNull();
    });

    it('should signIn with correct credentials', function() {
        var identity = 'TestIdentity',
            password = 'TEST',
            result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            params = $.parseJSON(params.data);

            if(identity === params.identity && params.password === password) {
                defer.resolve({result: true});
            } else {
                defer.resolve({result: false, message: 'Wrong credentials'});
            }
            return defer.promise();
        });

        // try sign up with wrong credentials
        user.signin({identity: 'unknown', password: password}).then(function(response) {
            result = response;
        });

        expect(result.result).not.toBeTruthy();

        user.signin({identity: identity, password: password}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should signout', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        // try sign up with wrong credentials
        user.signout().then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('get identity', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({name: 'Test', email: 'test@nive.io', realname: 'testname', reference: '123456789'});
            return defer.promise();
        });

        // try sign up with wrong credentials
        user.identity().then(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.name).not.toBeNull();
        expect(result.email).not.toBeNull();
        expect(result.realname).not.toBeNull();
        expect(result.reference).not.toBeNull();
    });

    it('get name', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({name: 'Test', realname: 'testname'});
            return defer.promise();
        });

        // try sign up with wrong credentials
        user.name().then(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.name).not.toBeNull();
        expect(result.realname).not.toBeNull();
    });

    it('get profile', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({name: 'Test', email: 'test@nive.io', realname: 'testname', reference: '123456789',
                           data: 'custom data', notify: true, activity: '12:00:00 12.06.2015'});
            return defer.promise();
        });

        // try sign up with wrong credentials
        user.profile().then(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.name).not.toBeNull();
        expect(result.email).not.toBeNull();
        expect(result.realname).not.toBeNull();
        expect(result.reference).not.toBeNull();
        expect(result.data).not.toBeNull();
        expect(result.notify).not.toBeNull();
        expect(result.activity).not.toBeNull();
    });

    it('should check authentication', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.authenticated().then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should check authentication for group and convert param', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            expect(params.groups).not.toBeNull();
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.authenticated({groups: ['mygroup']}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();

        user.authenticated({groups: 'mygroup'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();

        user.authenticated(['mygroup']).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();

        user.authenticated('mygroup').then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should signup direct', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.signupDirect({name: 'Test', email: 'test@nive.io', password: 'mypassword', data: 'user data'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to signup direct', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [['name', 'empty']], message: []});
            return defer.promise();
        });

        user.signupDirect({name: '', email: 'test@nive.io', password: 'mypassword', data: 'user data'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.invalid).toBeDefined();
        expect(result.message).toBeDefined();
    });

    it('should signup optin', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.signupOptin({name: 'Test', email: 'test@nive.io', password: 'mypassword', data: 'user data'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to signup optin', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [['name', 'empty']], message: []});
            return defer.promise();
        });

        user.signupOptin({name: '', email: 'test@nive.io', password: 'mypassword', data: 'user data'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.invalid).toBeDefined();
        expect(result.message).toBeDefined();
    });

    it('should signup review', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.signupReview({name: 'Test', email: 'test@nive.io', password: 'mypassword', data: 'user data'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to signup review', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [['name', 'empty']], message: []});
            return defer.promise();
        });

        user.signupReview({name: '', email: 'test@nive.io', password: 'mypassword', data: 'user data'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.invalid).toBeDefined();
        expect(result.message).toBeDefined();
    });

    it('should signup send password', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.signupSendpw({name: 'Test', email: 'test@nive.io', data: 'user data'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to signup send password', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [['name', 'empty']], message: []});
            return defer.promise();
        });

        user.signupSendpw({name: '', email: 'test@nive.io', data: 'user data'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.invalid).toBeDefined();
        expect(result.message).toBeDefined();
    });

    it('should signup uid', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.signupUid({password: 'Test', email: 'test@nive.io', data: 'user data'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to signup uid', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [['password', 'empty']], message: []});
            return defer.promise();
        });

        user.signupUid({password: '', email: 'test@nive.io', data: 'user data'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.invalid).toBeDefined();
        expect(result.message).toBeDefined();
    });

    it('should activate profile', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.activate({token: '1234567890'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to activate profile', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, message: ['invalid_token']});
            return defer.promise();
        });

        user.activate({token: ''}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.message).toBeDefined();
    });

    it('should update profile', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.update({data: 'new data', realname: 'oho', notify: false}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to update profile', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [["data", "too long"]], message: ''});
            return defer.promise();
        });

        user.update({data: 'new data', realname: 'oho', notify: false}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.invalid).toBeDefined();
        expect(result.message).toBeDefined();
    });

    it('should update password', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.updatePassword({password: 'pw', newpassword: 'newpw'}).then(function(response) {
            result = response;
        });



        expect(result.result).toBeTruthy();
    });

    it('should fail to update password', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [["newpassword", "too short"]], message: []});
            return defer.promise();
        });

        user.updatePassword({password: 'pw', newpassword: 'n'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.invalid).toBeDefined();
        expect(result.message).toBeDefined();
    });

    it('should update email', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.updateEmail({email: 'newmail@nive.io'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to update email', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [["email", "invalid"]], message: []});
            return defer.promise();
        });

        user.updateEmail({email: 'newmail-nive.io'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.invalid).toBeDefined();
        expect(result.message).toBeDefined();
    });

    it('should verify email', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.verifyEmail({email: 'newmail@nive.io'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to verify email', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [["email", "invalid"]], message: []});
            return defer.promise();
        });

        user.verifyEmail({email: 'newmail-nive.io'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.invalid).toBeDefined();
        expect(result.message).toBeDefined();
    });

    it('should activate verified email', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.verifyEmail2({token: '1234567890'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to activate verified email', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, message: ['invlaid_token']});
            return defer.promise();
        });

        user.verifyEmail2({token: ''}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.message).toBeDefined();
    });

    it('should reset password', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.resetPassword({identity: 'username'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to reset password', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, message: ['unknown_user']});
            return defer.promise();
        });

        user.resetPassword({identity: ''}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.message).toBeDefined();
    });

    it('should reset password with token', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.resetPassword2({token: '1234567890', newpassword: 'mynewpassword'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to reset password with token', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [["newpassword", "too short"]], message: []});
            return defer.promise();
        });

        user.resetPassword2({token: '1234567890', newpassword: 'n'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.message).toBeDefined();
    });

    it('should send a message', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.message({message: 'Hello!'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to send a message', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, message: ['empty']});
            return defer.promise();
        });

        user.message({message: ''}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.message).toBeDefined();
    });

    it('should show access allowed', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({delete: true});
            return defer.promise();
        });

        user.allowed({permission: 'delete'}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result['delete']).toBeTruthy();
    });

    it('should show multiple access allowed', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({delete: false, update: true});
            return defer.promise();
        });

        user.allowed({permission: ['delete', 'update']}).done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result['delete']).toBeFalsy();
        expect(result['update']).toBeTruthy();
    });

    it('should disable the profile', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.disable().then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should delete the profile', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.delete().then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should review profile', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.review({identity: 'Test', action: 'accept'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to review profile', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, message: 'unknown_user'});
            return defer.promise();
        });

        user.review({identity: '', action: 'accept'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.message).toBeDefined();
    });

    it('should get the user', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({name: 'Test', email: 'test@nive.io', realname: 'Tester', notify: false,
                           data: 'user data', activity: '12:00:00 12.06.2015', reference: '12345678',
                           active: true, pending: false});
            return defer.promise();
        });

        user.getUser({identity: 'Test'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.name).toBeDefined();
        expect(result.email).toBeDefined();
        expect(result.realname).toBeDefined();
        expect(result.notify).toBeDefined();
        expect(result.data).toBeDefined();
        expect(result.activity).toBeDefined();
        expect(result.reference).toBeDefined();
        expect(result.active).toBeDefined();
        expect(result.pending).toBeDefined();
    });

    it('should update the user', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.setUser({identity: 'Test', values: {realname: 'Tester', notify: false, data: 'user data',
                           active: true, pending: false}}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to update the user', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [['identity', 'empty']], message: []});
            return defer.promise();
        });

        user.setUser({identity: '', values: {realname: 'Tester', notify: false, data: 'user data',
                           active: true, pending: false}}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.invalid).toBeDefined();
        expect(result.message).toBeDefined();
    });

    it('should remove the user', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.removeUser({identity: 'Test'}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeTruthy();
    });

    it('should fail to remove the user', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: false, invalid: [['identity', 'empty']], message: []});
            return defer.promise();
        });

        user.removeUser({identity: ''}).then(function(response) {
            result = response;
        });

        expect(result.result).toBeFalsy();
        expect(result.invalid).toBeDefined();
        expect(result.message).toBeDefined();
    });

    it('should list users', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({users: [{name: 'Test', email: 'test@nive.io', realname: 'Tester',
                           activity: '12:00:00 12.06.2015', reference: '12345678',
                           active: true, pending: false}],
                           start: 1, size: 20});
            return defer.promise();
        });

        user.list().then(function(response) {
            result = response;
        });

        expect(result.users.length).toEqual(1);
        expect(result.users[0].name).toEqual('Test');
        expect(result.start).toEqual(1);
        expect(result.size).toEqual(20);
    });

    it('should list selected users', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({users: [{name: 'Test', email: 'test@nive.io', realname: 'Tester',
                           activity: '12:00:00 12.06.2015', reference: '12345678',
                           active: false, pending: true}],
                           start: 1, size: 20});
            return defer.promise();
        });

        user.list({active: false, pending: true, start: 1}).then(function(response) {
            result = response;
        });

        expect(result.users.length).toEqual(1);
        expect(result.users[0].name).toEqual('Test');
        expect(result.start).toEqual(1);
        expect(result.size).toEqual(20);
    });

    it('should list user identities', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({users: [{name: 'Test', reference: '12345678'}, {name: 'Test 2', reference: '2-12345678'}],
                           start: 1, size: 20});
            return defer.promise();
        });

        user.identities().then(function(response) {
            result = response;
        });

        expect(result.users.length).toEqual(2);
        expect(result.users[0].name).toEqual('Test');
        expect(result.start).toEqual(1);
        expect(result.size).toEqual(20);
    });

    it('should list selected user identities', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({users: [{name: 'Test', reference: '12345678'}],
                           start: 1, size: 20});
            return defer.promise();
        });

        user.identities({active: false, pending: true, start: 1}).then(function(response) {
            result = response;
        });

        expect(result.users.length).toEqual(1);
        expect(result.users[0].name).toEqual('Test');
        expect(result.start).toEqual(1);
        expect(result.size).toEqual(20);
    });

    it('should set permissions', function() {
        var result = null;

        spyOn($, 'ajax').and.callFake(function (resource, params) {
            var defer = $.Deferred();
            defer.resolve({result: true});
            return defer.promise();
        });

        user.setPermissions({permissions: {permission: 'update', group: 'sys:owner'}}).done(function(response) {
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

        user.setPermissions({permissions: [{permission: 'update', group: 'sys:owner'},
                                           {permission: 'disable', group: 'sys:owner'}]}).done(function(response) {
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

        user.setPermissions({permissions: {permission: 'update', group: 'sys:owner', action: 'revoke'}}).done(function(response) {
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

        user.setPermissions({permissions: {permission: 'whatever', group: 'sys:owner'}}).done(function(response) {
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

        user.ping().done(function(response) {
            result = response;
        });

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });
});
