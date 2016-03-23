(function(){
    'use strict';
    var app = angular.module('app', [], function config($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptor');
    });

    app.constant('API_URL', 'http://localhost:3000');

    app.controller('MainCtrl', function(RandomUserFactory, UserFactory){
        'use strict';
        var vm = this;
        vm.getRandomUser = getRandomUser;
        vm.login = login;
        vm.logout = logout;

        //initialization
        UserFactory.getUser().then(function(response){
            vm.user = response.data;
        });


        function getRandomUser(){
            RandomUserFactory.getUser().then(function(response){
                vm.randomUser = response.data;
            }, handleError);
        }

        function login(username, password){
            UserFactory.login(username, password).then(function(response){
                vm.user = response.data.user;
            }, handleError);
        }

        function logout(){
            UserFactory.logout();
            vm.user = null;
        }

        function handleError(response){
            console.log('Error' + response.data)
        }
    });

    app.factory('RandomUserFactory', function($http, API_URL){
        function getUser(){
            return $http.get(API_URL + '/random-user');
        }

        return {
            getUser: getUser
        }
    });
    app.factory('UserFactory', function($http, API_URL, AuthTokenFactory, $q){
        function login(username, password){
            return $http.post(API_URL + '/login', {
                username: username,
                password: password
            }).then(function(response){
                AuthTokenFactory.setToken(response.data.token);
                return response;
            })
        }

        function logout(){
            AuthTokenFactory.setToken();
        }

        function getUser(){
            if (AuthTokenFactory.getToken()) {
                return $http.get(API_URL + '/me')
            } else {
                return $q.reject({data: 'Client has no auth token'});
            }
        }

        return {
            login: login,
            logout: logout,
            getUser: getUser
        }
    });
    app.factory('AuthTokenFactory', function($window){
        var store = $window.localStorage;
        var key = 'auth-token';

        function getToken(){
            return store.getItem(key);
        }

        function setToken(token){
            if (token)
                store.setItem(key, token);
            else
                store.removeItem(key);
        }

        return {
            getToken: getToken,
            setToken: setToken
        }
    });
    app.factory('AuthInterceptor', function(AuthTokenFactory){
        return {request: addToken};

        function addToken(config){
            var token = AuthTokenFactory.getToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        }
    });
})();