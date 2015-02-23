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
