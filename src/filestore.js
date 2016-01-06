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
            // values: {name}
            if(typeof values == 'string' || values instanceof String) {
                values = { name: values };
            }
            return this._send('@getItem', values, ajaxSettings);
        };
        this.newItem = function (values, ajaxSettings) {
            // values: {name, contents, type, mime, header}
            return this._send('@newItem', values, ajaxSettings);
        };
        this.setItem = function (values, ajaxSettings) {
            // values: {name, contents, mime, header}
            return this._send('@setItem', values, ajaxSettings);
        };
        this.removeItem = function (values, ajaxSettings) {
            // values: {name, recursive}
            return this._send('@removeItem', values, ajaxSettings);
        };
        this.read = function (values, ajaxSettings) {
            // values: {name}
            if(typeof values == 'string' || values instanceof String) {
                values = { name: values };
            }
            return this._send('@read', values, ajaxSettings);
        };
        this.write = function (values, ajaxSettings) {
            // values: {name, contents}
            return this._send('@write', values, ajaxSettings);
        };
        this.move = function (values, ajaxSettings) {
            // values: {name, newpath}
            return this._send('@move', values, ajaxSettings);
        };
        this.list = function (values, ajaxSettings) {
            // values: {name, type, sort, order, size, start}
            return this._send('@list', values, ajaxSettings);
        };
        this.allowed = function (values, ajaxSettings) {
            // values: {name, permission}
            return this._send('@allowed', values, ajaxSettings);
        };
        this.getPermissions = function (values, ajaxSettings) {
            // values: {name}
            if(typeof values == 'string' || values instanceof String) {
                values = { name: values };
            }
            return this._send('@getPermissions', values, ajaxSettings);
        };
        this.setPermissions = function (values, ajaxSettings) {
            // values: {name, permissions}
            return this._send('@setPermissions', values, ajaxSettings);
        };
        this.getOwner = function (values, ajaxSettings) {
            // values: {name}
            if(typeof values == 'string' || values instanceof String) {
                values = { name: values };
            }
            return this._send('@getOwner', values, ajaxSettings);
        };
        this.setOwner = function (values, ajaxSettings) {
            // values: {name, owner}
            return this._send('@setOwner', values, ajaxSettings);
        };
        this.ping = function (values, ajaxSettings) {
            // values:
            values = values||{};
            values.name = '/';
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
            if(values&&values.name) { extendedPath = values.name; }
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
