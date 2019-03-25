import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import './calendar.css';

const localizer = BigCalendar.momentLocalizer(moment);

class CbsFullCalendar extends React.Component {
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
    };
	}

	render() {
		return (
			<BrowserRouter>
				<div className='h-80vh'>
					<div>
						<Link className='btn' to="/calendar/edit/event">Add New Event</Link>
					</div>
					<BigCalendar
						localizer = {localizer}
						events = {this.state.events}
						views={['month', 'week', 'day']}
					/>
				</div>
			</BrowserRouter>
		);
	}
}

export default CbsFullCalendar;