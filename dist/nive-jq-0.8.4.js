// (c) 2013-2016 Nive GmbH - nive.io
// 
// nive-jq v0.8.4
// 
// License: Released under MIT-License. See http://jquery.org/license
// Docs: http://www.nive.co/docs/webapi
//

// (c) 2013-2015 Nive GmbH - nive.io
// This file is released under the MIT-License. See http://jquery.org/license
//
// Nive api endpoint url construction
// Docs: http://www.nive.co/docs/webapi/endpoint.html
//
// Requires <nothing>


window.nive = window.nive || {};
nive.endpoint = nive.endpoint || {};
(function () {
'use strict';


nive.endpoint.makeUrl = function (options, extendedPath) {
    /*
     options: method, service, domain, path, secure, version
     extendedPath: additional relative path to be used in services with tree like structures
    * */
    options = options||{};
    var defaultDomain = '.nive.io';
    var protocol = 'https';

    // protocol
    if(options.secure==false) { protocol = 'http:'; }
    else if(protocol.indexOf(':')!=protocol.length-1) { protocol += ':'; }

    // domain
    var domain = options.domain || '';
    if(domain) {
        // if '.' contained in domain, a fully qualified domain expected
        domain = domain.indexOf('.')==-1 ? domain+defaultDomain : domain;
    }

    // version
    var version = options.version || 'api';

    // method
    var method = options.method;

    // construct path
    var path=extendedPath;
    if(path||options.path) {
        if(!path) {
            path = options.path;
        } else if(options.path&&!path.indexOf('/')==0) {
            if(options.path.lastIndexOf('/')!=path.length-1) { path = '/'+path; }
            path = options.path+path;
        }
        // relative directory
        // this option is not supported by all services
        if(path.indexOf('./')==0||path.indexOf('../')==0) {
            if(!method) {
              return path;
            }
            if(path.lastIndexOf('/')!=path.length-1) { path += '/'; }
            return path + method;
        }
        // remove slash
        if(path.indexOf('/')==0) { path = path.substr(1, path.length); }
        if(path.lastIndexOf('/')==path.length-1) { path = path.substr(0, path.length-1); }
    }

    // service name
    if(!options.service) { throw 'Invalid service name'; }
    var service = options.service||'';

    // make url
    var url = '';
    if(domain) { url = protocol + '//' + domain; }
    url += '/' + service;
    if(version) { url += '/'+version; }
    if(path) { url += '/'+path; }
    if(method) { url += '/'+method; }
    return url;
};

nive.endpoint.EndpointException = function (message) {
    this.message = message;
    this.name = 'EndpointException';
};

})();

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

        this.activate = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = {token: values};
            }
            return this._send('activate', values, ajaxSettings);
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

// (c) 2013-2015 Nive GmbH - nive.io
// This file is released under the MIT-License. See http://jquery.org/license
//
// Nive KeyValueStore jQuery wrapper: jq-kvstore.js
// Docs: http://www.nive.co/docs/webapi/kvstore.html#api
//
// Requires
// - jQuery >= 1.8
// - nive.endpoint >= 0.6


window.nive = window.nive || {};
nive.KvStore = nive.KvStore || {};
(function () {
'use strict';

    nive.KvStore = function (options) {
        this.__options = options||{};
        if(typeof options == 'string' || options instanceof String) {
            this.__options = { service: options };
        }

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

        this.getItem = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = { key: values };
            }
            return this._send('getItem', values, ajaxSettings);
        };

        this.newItem = function (values, ajaxSettings) {
            if(Object.prototype.toString.call(values) == '[object Array]') {
                values = { items: values };
            }
            return this._send('newItem', values, ajaxSettings);
        };

        this.setItem = function (values, ajaxSettings) {
            if(Object.prototype.toString.call(values) == '[object Array]') {
                values = { items: values };
            }
            return this._send('setItem', values, ajaxSettings);
        };

        this.removeItem = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = { key: values };
            }
            return this._send('removeItem', values, ajaxSettings);
        };

        this.list = function (values, ajaxSettings) {
            return this._send('list', values, ajaxSettings);
        };

        this.keys = function (values, ajaxSettings) {
            return this._send('keys', values, ajaxSettings);
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

// (c) 2013-2015 Nive GmbH - nive.io
// This file is released under the MIT-License. See http://jquery.org/license
//
// Nive FileStore jQuery wrapper: jq-filestore.js
// Docs: http://www.nive.co/docs/webapi/filestore.html#api
//
// Requires
// - jQuery >= 1.8
// - nive.endpoint >= 0.6


window.nive = window.nive || {};
nive.FileStore = nive.FileStore || {};
(function () {
'use strict';

    nive.FileStore = function (options) {
        this.__options = options||{};
        if(typeof options == 'string' || options instanceof String) {
            this.__options = { service: options };
        }

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

        this.getItem = function (values, ajaxSettings) {
            // values: {path}
            if(typeof values == 'string' || values instanceof String) {
                values = { path: values };
            }
            return this._send('@getItem', values, ajaxSettings);
        };
        this.newItem = function (values, ajaxSettings) {
            // values: {name, path, contents, type, mime, header}
            return this._send('@newItem', values, ajaxSettings);
        };
        this.setItem = function (values, ajaxSettings) {
            // values: {path, contents, mime, header}
            return this._send('@setItem', values, ajaxSettings);
        };
        this.removeItem = function (values, ajaxSettings) {
            // values: {path, recursive}
            return this._send('@removeItem', values, ajaxSettings);
        };
        this.read = function (values, ajaxSettings) {
            // values: {path}
            if(typeof values == 'string' || values instanceof String) {
                values = { path: values };
            }
            return this._send('@read', values, ajaxSettings);
        };
        this.write = function (values, ajaxSettings) {
            // values: {path, contents}
            return this._send('@write', values, ajaxSettings);
        };
        this.move = function (values, ajaxSettings) {
            // values: {path, newpath}
            return this._send('@move', values, ajaxSettings);
        };
        this.list = function (values, ajaxSettings) {
            // values: {path, type, sort, order, size, start}
            return this._send('@list', values, ajaxSettings);
        };
        this.allowed = function (values, ajaxSettings) {
            // values: {path, permission}
            return this._send('@allowed', values, ajaxSettings);
        };
        this.getPermissions = function (values, ajaxSettings) {
            // values: {path}
            if(typeof values == 'string' || values instanceof String) {
                values = { path: values };
            }
            return this._send('@getPermissions', values, ajaxSettings);
        };
        this.setPermissions = function (values, ajaxSettings) {
            // values: {path, permissions}
            return this._send('@setPermissions', values, ajaxSettings);
        };
        this.getOwner = function (values, ajaxSettings) {
            // values: {path}
            if(typeof values == 'string' || values instanceof String) {
                values = { path: values };
            }
            return this._send('@getOwner', values, ajaxSettings);
        };
        this.setOwner = function (values, ajaxSettings) {
            // values: {path, owner}
            return this._send('@setOwner', values, ajaxSettings);
        };
        this.ping = function (values, ajaxSettings) {
            // values:
            values = values||{};
            values.path = '/';
            return this._send('@ping', values, ajaxSettings);
        };

        this._send = function (method, values, ajaxSettings) {
            if(typeof jQuery=='undefined') {
                // not implemented yet
                throw 'Sorry, jQuery required!';
            }
            this.__options.method = method;
            this.__options.version = '';
            var extendedPath = null;
            if(values&&values.path) { extendedPath = values.path; }
            var url = nive.endpoint.makeUrl(this.__options, extendedPath);
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
