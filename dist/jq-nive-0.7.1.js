/**
 * (c) 2013-2015 Nive GmbH - www.nive.co
 * 
 * jq-nive v0.7.1
 * http://www.nive.co
 * 
 * License: MIT
 */
'use strict';

// (c) 2013-2014 Nive GmbH - www.nive.co
// This file is released under the MIT-License. See http://jquery.org/license
//
// Nive api endpoint url construction
// ----------------------------------
// Documentation: http://www.nive.co/docs/webapi/endpoints.html
//
// Requires <nothing>

'use strict';

window.nive = window.nive || {};
nive.endpoint = nive.endpoint || {};
(function () {

nive.endpoint.apiUrl = function (options) {
    /* values: method, name, domain, path, secure, relative, outpost */
    options = options||{};
    return nive.endpoint.__makeUrl(options,true);
};

nive.endpoint.widgetUrl = function (options) {
    /* values: method, name, domain, path, secure, outpost */
    options = options||{};
    options.version = 'widgets';
    return nive.endpoint.__makeUrl(options);
};

nive.endpoint.EndpointException = function (message) {
    this.message = message;
    this.name = 'EndpointException';
};


nive.endpoint.__makeUrl = function (options) {
    /* values: method, name, domain, path, secure, outpost */
    options = options||{};
    var defaultDomain = '.nive.io';
    var defaultOutpost = 'http://127.0.0.1:5556';
    var domainPlaceholder = '__domain';
    var devmodePrefix = '__proxy';

    // protocol
    var protocol = options.protocol || document.location.protocol;
    if(options.secure) { protocol = 'https:'; }
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

    // outpost development proxy
    var outpost = options.outpost || defaultOutpost;
    var devmode = window.location.href.indexOf(outpost)==0?9:0;

    // base path
    var path = options.path;
    if(path) {
        // relative directory
        if(path.indexOf('./')==0||path.indexOf('../')==0) {
            // not supported in if devmode=9
            if(path.lastIndexOf('/')!=path.length-1) { path += '/'; }
            return path + method;
        }
        // remove slash
        if(path.indexOf('/')==0) { path = path.substr(1, path.length); }
        if(path.lastIndexOf('/')==path.length-1) { path = path.substr(0, path.length-1); }
    }

    // service name
    if(!options.name && !options.relative) { throw 'Invalid service name'; }
    var name = options.name||'';

    // make url
    var url = '';
    if(devmode==9) {
        if(name=='') { throw 'Service name required in development mode'; }
        if(domain=='') { domain = domainPlaceholder; }
        url = outpost + '/' + devmodePrefix + '/' + domain;
    }
    else if(domain) {
        url = protocol + '//' + domain;
    }
    url += '/' + name;
    if(version) { url += '/'+version; }
    if(path) { url += '/'+path; }
    if(method) { url += '/'+method; }
    return url;
};
})();

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

// (c) 2013-2014 Nive GmbH - www.nive.co
// This file is released under the MIT-License. See http://jquery.org/license
//
// Nive FileHost jQuery wrapper: jq-filehost.js
// ------------------------------------------------
// Documentation: http://www.nive.co/docs/webapi/filehost.html#api
//
// Requires
// - jQuery >= 1.8
// - nive.endpoint >= 0.6

'use strict';

window.nive = window.nive || {};
nive.FileHost = nive.FileHost || {};
(function () {

    nive.FileHost = function (options) {
        options = options||{};
        if(typeof options == 'string' || options instanceof String) {
            options = { name: options };
        }
        this.options = options;

        this.list = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = { path: values };
            }
            return this._send('@list', values, ajaxSettings);
        };
        this.details = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = { path: values };
            }
            return this._send('@details', values, ajaxSettings);
        };
        this.properties = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = { path: values };
            }
            return this._send('@properties', values, ajaxSettings);
        };

        this._send = function (method, values, ajaxSettings) {
            if(typeof jQuery=='undefined') {
                // not implemented yet
                throw 'Sorry, jQuery required!';
            }
            this.options.method = method;
            this.options.version = '';
            if(values&&values.path) { this.options.path = values.path; }
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
