import angular from 'angular';
import { react2angular } from 'react2angular';
import CbsFullCalendar from './calendar.jsx';

angular
	.module('calendarModule', [])
	.component('cbsFullCalendar', react2angular(CbsFullCalendar));