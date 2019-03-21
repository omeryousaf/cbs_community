import React from 'react';
import ReactDOM from 'react-dom';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import './calendar.css';

const localizer = BigCalendar.momentLocalizer(moment);

class CBSReactCalendarApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			events:[{
				title: 'All Day Event',
				start: moment('2019-03-15').toDate(),
				end: moment('2019-03-15').add(2, 'hours').toDate()
			}, {
				title: 'Long Event',
				start: moment('2019-03-16').toDate(),
				end: moment('2019-03-18').toDate()
			}]
    }
  }

  render() {
    return (
			<div className='h-90vh'>
				<BigCalendar
					localizer = {localizer}
					events = {this.state.events}
				/>
			</div>
		);
  }

}

ReactDOM.render(
	<CBSReactCalendarApp name="omer" />,
  document.getElementById('cbs-alumni-calendar-app')
);