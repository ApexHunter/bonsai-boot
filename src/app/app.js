var configApi = { Url: 'http://localhost:60438/api/' };
var refState;
var App;

AppController.$inject = ['$timeout', '$rootScope', '$uibModal', 'api', '$cookies', '$state'];
function AppController($timeout, $rootScope, $uibModal, api, $cookies, $state) {
  App = this;

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    // $timeout(function () {
    //   //check se tem tabela e precisa de rolagem
    //   resizeTable('.table-box__scroll');
    //   window.onresize = function() {
    //     resizeTable('.table-box__scroll');
    //   }
    // });

    $rootScope.windowSize = $(window).height() - 170;
  });

  $rootScope.windowSize = $(window).height() - 170;
  $timeout(function() {
    //funções globais js especificas, principalmente jquery
  });
}
