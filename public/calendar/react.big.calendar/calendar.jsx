import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as moment from 'moment';
import axios from 'axios';

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

	async componentDidMount() {
		try {
			let response = await axios.get('/api/events');
			response.data.events = response.data.events.map((event) => {
				event.doc.start = moment.unix(event.doc.start).toDate();
				event.doc.end = moment.unix(event.doc.end).toDate();
				return event.doc;
			});
			this.setState({
				events: response.data.events
			});
		} catch(error) {
			console.log(error);
		}
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