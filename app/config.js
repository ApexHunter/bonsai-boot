appAngular = angular
    .module('app', ['ui.router', 'ui.bootstrap', 'ui.slimscroll', 'ngTouch', 'ngSanitize', 'restangular', 'ngCookies', 'angular.filter'])
    //Controllers
    .controller('AppController', AppController)
    .controller('HomeController', HomeController)
    .controller('ProdutosController', ProdutosController)
    .controller('DetalheController', DetalheController)
    .controller('VariacaoProdutosController', VariacaoProdutosController)

    //directives
    .directive('editable', editable)
    .directive('select2', select2)

    //Filters

    //Outros
    .config(config)
    .service('api', api);

config.$inject = ['$stateProvider', '$urlRouterProvider', '$compileProvider', '$locationProvider', 'RestangularProvider'];
function config($stateProvider, $urlRouterProvider, $compileProvider, $locationProvider, RestangularProvider) {
    var rand = Math.random();
    $urlRouterProvider.otherwise("/home");
    RestangularProvider.setBaseUrl('');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    $locationProvider.hashPrefix('');

    $stateProvider
    .state('template', {
        url: '',
        abstract: true,
        templateUrl: 'app/views/templates/layout.html?r=' + rand,
        controller: 'AppController as App'
    })
    .state('template.home', {
        url: '/home',
        templateUrl: 'views/home/home.html?r=' + rand,
        controller: 'HomeController as Home'
    })



    //RestAngular
    RestangularProvider.setResponseExtractor(function (response, operation, url) {
        if (response.Data != undefined) {
            return response.Data;
        } else if (url == 'GetDataListCustom' || url == 'GetByModel') {
            return response.DataList;
        } else if(response.DataList != undefined){
            return response.DataList;
        }else if(Object.prototype.toString.call(response) !== '[object Array]'){
            return [response];
        }

        return response;
    });
}
