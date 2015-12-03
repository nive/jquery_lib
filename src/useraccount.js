// (c) 2013-2015 Nive GmbH - nive.io
// This file is released under the MIT-License. See http://jquery.org/license
//
// Nive UserAccountService jQuery wrapper: jq-useraccount.js
// Docs: http://www.nive.co/docs/webapi/useraccount.html#api
//
// Requires
// - jQuery >= 1.8
// - nive.endpoint >= 0.6


window.nive = window.nive || {};
nive.User = nive.User || {};
(function () {
'use strict';

    nive.User = function (options) {
        this.__options = options||{};
        if(typeof options == 'string' || options instanceof String) {
            this.__options = { service: options };
        }
        this.__options.service = 'users';

        this.options = function (option, value) {
            if(typeof option == 'string' || option instanceof String) {
                if (value != undefined) {
                    this.__options[option] = value;
                } else {
                    return this.__options[option];
                }
            } else {
                this.__options = option;
            }
            return this.__options;
        };

        // user account handling
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
        this.verifyEmail = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = {email: values};
            }
            return this._send('verifyEmail', values, ajaxSettings);
        };
        this.verifyEmail2 = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = {token: values};
            }
            return this._send('verifyEmail2', values, ajaxSettings);
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
        this.message = function (values, ajaxSettings) {
            return this._send('message', values, ajaxSettings);
        };

        this.disable = function (values, ajaxSettings) {
            return this._send('disable', values, ajaxSettings);
        };
        this.delete = function (values, ajaxSettings) {
            return this._send('delete', values, ajaxSettings);
        };

        // signup process handling
        this.signupDirect = function (values, ajaxSettings) {
            return this._send('signupDirect', values, ajaxSettings);
        };
        this.signupOptin = function (values, ajaxSettings) {
            return this._send('signupOptin', values, ajaxSettings);
        };
        this.signupReview = function (values, ajaxSettings) {
            return this._send('signupReview', values, ajaxSettings);
        };
        this.signupSendpw = function (values, ajaxSettings) {
            return this._send('signupSendpw', values, ajaxSettings);
        };
        this.signupUid = function (values, ajaxSettings) {
            return this._send('signupUid', values, ajaxSettings);
        };

        this.signupConfirm = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = {token: values};
            }
            return this._send('signupConfirm', values, ajaxSettings);
        };

        this.review = function (values, ajaxSettings) {
            return this._send('review', values, ajaxSettings);
        };

        // admin functions
        this.getUser = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = {identity: values};
            }
            return this._send('getUser', values, ajaxSettings);
        };
        this.setUser = function (values, ajaxSettings) {
            return this._send('setUser', values, ajaxSettings);
        };
        this.removeUser = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = {identity: values};
            }
            return this._send('removeUser', values, ajaxSettings);
        };
        this.list = function (values, ajaxSettings) {
            return this._send('list', values, ajaxSettings);
        };

        this._send = function (method, values, ajaxSettings) {
            if(typeof jQuery=='undefined') {
                // not implemented yet
                throw 'Sorry, jQuery required!';
            }
            this.__options.method = method;
            this.__options.version = 'api';
            var url = nive.endpoint.makeUrl(this.__options);
            ajaxSettings = ajaxSettings||{};
            ajaxSettings.data = JSON.stringify(values);
            ajaxSettings.dataType = 'json';
            ajaxSettings.contentType = 'application/json';
            if(this.__options.token) {
                if(ajaxSettings.headers) { ajaxSettings.headers['x-auth-token'] = this.__options.token; }
                else { ajaxSettings.headers = {'x-auth-token': this.__options.token}; }
            }
            if(!ajaxSettings.type) { ajaxSettings.type = values ? 'POST':'GET'; }
            return $.ajax(url, ajaxSettings);
        };

        return this;
    };

})();
