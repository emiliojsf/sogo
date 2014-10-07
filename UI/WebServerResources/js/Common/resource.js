/* -*- Mode: javascript; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

(function() {
  'use strict';

  /* Constructor  */
  function Resource($http, $q, path, options) {
    angular.extend(this, {
      _http: $http,
      _q: $q,
      _path: path
    });
    angular.extend(this, options);
  }

  /* The factory we'll use to register with Angular */
  Resource.$factory =  ['$http', '$q', function($http, $q) {
    return function(path, options) {
      return new Resource($http, $q, path, options);
    };
  }];

  /* Factory registration in Angular module */
  angular.module('SOGo.Common').factory('sgResource', Resource.$factory);

  /* Instance methods */

  Resource.prototype.path = function(uid) {
    return (uid ? this._path + '/' + uid : this._path) + '/view';
  };

  Resource.prototype.find = function(uid) {
    var deferred = this._q.defer();

    this._http
      .get(this.path(uid))
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  Resource.prototype.filter = function(uid, params) {
    var deferred = this._q.defer();

    this._http({
      method: 'GET',
      url: this.path(uid),
      params: params
    })
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  Resource.prototype.newguid = function(uid) {
    var deferred = this._q.defer(),
        path = this._path + '/' + uid + '/newguid';

    this._http
      .get(path)
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  /**
   * @function create
   * @desc Create a new resource using a specific action
   * @param {string} action - the action to be used in the URL
   * @param {string} name - the new resource's name
   */
  Resource.prototype.create = function(action, name) {
    var deferred = this._q.defer(),
        path = this._path + '/' + action;

    this._http
      .post(path, { name: name })
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  Resource.prototype.save = function(uid, newValue, options) {
    var deferred = this._q.defer(),
        action = (options && options.action)? options.action : 'save',
        path = this._path + '/' + uid + '/' + action;

    this._http
      .post(path, newValue)
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  Resource.prototype.remove = function(uid) {
    var deferred = this._q.defer(),
        path = this._path + '/' + uid + '/delete';

    this._http
      .get(path)
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  /**
   * @function fetch
   * @desc Fetch resources using a specific object, action and/or parameters
   * @param {string} object_id - the object on which the action will be applied (ex: addressbook, calendar)
   * @param {string} action - the action to be used in the URL
   * @param {string} params - the url parameter 
   */
  Resource.prototype.fetch = function(object_id, action, params) {
    var deferred = this._q.defer();
    var object_id_path = object_id ? ("/" + object_id) : "";
    var action_path = action ? ("/" + action) : "";
    var params_path = params ? ("?" + params) : "";

    var path = this._path + object_id_path + action_path + params_path;

    this._http
        .get(path)
        .success(deferred.resolve)
        .error(deferred.reject);

    return deferred.promise;
  };

  Resource.prototype.saveAclUsers = function(object_id, action, data) {
    var deferred = this._q.defer();
    var object_id_path = object_id ? ("/" + object_id) : "";
    var action_path = action ? ("/" + action) : "";
    var path = this._path + object_id_path + action_path;

    this._http
        .post(path, data)
        .success(deferred.resolve)
        .error(deferred.reject);

    return deferred.promise;
  };
})();