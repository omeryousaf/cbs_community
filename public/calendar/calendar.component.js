function calendarController(ConfigService) {}

angular.module('calendarComponent', []).component('calendar', {
  controller: ['ConfigService', calendarController]
});