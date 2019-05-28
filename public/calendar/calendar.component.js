import angular from 'angular';
import { react2angular } from 'react2angular';
import CbsFullCalendar from './react.big.calendar/calendar.jsx';
import EditEvent from './event.edit/event.edit.jsx';

angular
	.module('calendarModule', [])
	.component('cbsFullCalendar', react2angular(CbsFullCalendar))
	.component('eventEdit', react2angular(EditEvent));