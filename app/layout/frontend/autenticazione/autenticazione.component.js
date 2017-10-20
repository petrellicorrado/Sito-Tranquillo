// Definizione del modulo 'autenticazione'
angular.module('autenticazione', [
    'ngRoute',
    'ngMessages'
]);

// Registra il componente 'autenticazione' sul modulo 'autenticazione'

angular.module('autenticazione')
    .component('autenticazione', {
        templateUrl: 'layout/frontend/autenticazione/autenticazione.template.html',
        controller: 'autenticazioneCtrl'
    });