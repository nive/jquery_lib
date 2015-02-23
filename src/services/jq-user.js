// (c) 2013-2014 Nive GmbH - www.nive.co
// This file is released under the MIT-License. See http://jquery.org/license
//
// Nive DataStorage jQuery wrapper: jq-user.js
// ------------------------------------------------
// Documentation: http://www.nive.co/docs/webapi/useraccounts.html#api
//
// Requires
// - jQuery >= 1.8
// - nive.endpoint >= 0.6

'use strict';

window.nive = window.nive || {};
nive.User = nive.User || {};
(function () {

    nive.User = function (options) {
        options=options||{};
        options.name='users';
        this.options = options;

        this.token = function (values, ajaxSettings) {
            return this._send('token', values, ajaxSettings);
        };
        this.signin = function (values, ajaxSettings) {
            return this._send('signin', values, ajaxSettings);
        };
        this.signout = function (ajaxSettings) {
            return this._send('signout', {}, ajaxSettings);
        };
        this.identity = function (ajaxSettings) {
            return this._send('identity', {}, ajaxSettings);
        };
        this.name = function (ajaxSettings) {
            return this._send('name', {}, ajaxSettings);
        };
        this.profile = function (ajaxSettings) {
            return this._send('profile', {}, ajaxSettings);
        };
        this.authenticated = function (values, ajaxSettings) {
            if(Object.prototype.toString.call(values) == '[object Array]') {
                values={groups: values};
            }
            if(typeof values == 'string' || values instanceof String) {
                values = {groups: [values]};
            }
            return this._send('authenticated', values, ajaxSettings);
        };
        this.signup = function (values, ajaxSettings) {
            return this._send('signup', values, ajaxSettings);
        };
        this.signup2 = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = {token: values};
            }
            return this._send('signup2', values, ajaxSettings);
        };
        this.update = function (values, ajaxSettings) {
            return this._send('update', values, ajaxSettings);
        };
        this.updatePassword = function (values, ajaxSettings) {
            return this._send('updatePassword', values, ajaxSettings);
        };
        this.updateEmail = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = {email: values};
            }
            return this._send('updateEmail', values, ajaxSettings);
        };
        this.updateEmail2 = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = {token: values};
            }
            return this._send('updateEmail2', values, ajaxSettings);
        };
        this.resetPassword = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = {identity: values};
            }
            return this._send('resetPassword', values, ajaxSettings);
        };
        this.resetPassword2 = function (values, ajaxSettings) {
            return this._send('resetPassword2', values, ajaxSettings);
        };

        this._send = function (method, values, ajaxSettings) {
            if(typeof jQuery=='undefined') {
                // not implemented yet
                throw 'Sorry, jQuery required!';
            }
            this.options.method = method;
            this.options.version = 'api';
            var url = nive.endpoint.apiUrl(this.options);
            ajaxSettings = ajaxSettings||{};
            ajaxSettings.data = JSON.stringify(values);
            ajaxSettings.dataType = 'json';
            ajaxSettings.contentType = 'application/json';
            if(this.options.token) {
                if(ajaxSettings.headers) { ajaxSettings.headers['x-auth-token'] = this.options.token; }
                else { ajaxSettings.headers = {'x-auth-token': this.options.token}; }
            }
            if(!ajaxSettings.type) { ajaxSettings.type = values ? 'POST':'GET'; }
            return $.ajax(url, ajaxSettings);
        };

        return this;
    };

})();
