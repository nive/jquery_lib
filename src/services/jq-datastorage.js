// (c) 2013-2014 Nive GmbH - www.nive.co
// This file is released under the MIT-License. See http://jquery.org/license
//
// Nive DataStorage jQuery wrapper: jq-datastorage.js v0.6.1
// --------------------------------------------------------
// Documentation: http://www.nive.co/docs/webapi/datastore.html#api
//
// Requires
// - jQuery >= 1.8
// - nive.endpoint >= 0.6

'use strict';

window.nive = window.nive || {};
nive.DataStorage = nive.DataStorage || {};
(function () {

    nive.DataStorage = function (options) {
        if(typeof options == 'string' || options instanceof String) {
            options = { name: options };
        }
        this.options = options;

        this.getItem = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = { key: values };
            }
            return this._send('getItem', values, ajaxSettings);
        };
        this.list = function (values, ajaxSettings) {
            return this._send('list', values, ajaxSettings);
        };
        this.keys = function (values, ajaxSettings) {
            return this._send('keys', values, ajaxSettings);
        };
        this.newItem = function (values, ajaxSettings) {
            if(Object.prototype.toString.call(values) == '[object Array]') {
                values={items: values};
            }
            return this._send('newItem', values, ajaxSettings);
        };
        this.setItem = function (values, ajaxSettings) {
            if(Object.prototype.toString.call(values) == '[object Array]') {
                values={items: values};
            }
            return this._send('setItem', values, ajaxSettings);
        };
        this.removeItem = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = { key: values };
            }
            return this._send('removeItem', values, ajaxSettings);
        };
        // bw 0.6 renamed functionjq-datastorage-0.6.js
        this.deleteItem = function (values, ajaxSettings) {
            if(typeof values == 'string' || values instanceof String) {
                values = { key: values };
            }
            return this._send('removeItem', values, ajaxSettings);
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
