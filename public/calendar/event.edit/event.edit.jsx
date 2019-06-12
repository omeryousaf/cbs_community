import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';

class EditEvent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			startDate: moment().toDate(),
			endDate: moment().toDate(),
			location: ''
		};
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handleText = this.handleText.bind(this);
		this.save = this.save.bind(this);
		this.update = this.update.bind(this);
	}

	async componentDidMount() {
		try {
			const urlFragments = window.location.href.split('/event/');
			if (urlFragments.length > 1 && urlFragments[1]) {
				const eventId = urlFragments[1];
				const response = await axios.get(`/api/events/${eventId}`);
				const event = response.data;
				this.setState({
					_id: event._id,
					_rev: event._rev,
					title: event.title,
					startDate: moment.unix(event.start).toDate(),
					endDate: moment.unix(event.end).toDate(),
					location: event.location,
					isEditScreen: true
				});
			}
		} catch(error) {
			console.log(error);
		}
	}

	handleStartDateChange(date) {
		this.setState({
			startDate: date
		});
		if (moment(date) > moment(this.state.endDate)) {
			this.setState({
				endDate: date
			});
		}
	}
	handleEndDateChange(date) {
		this.setState({
			endDate: date
		});
		if (moment(date) < moment(this.state.startDate)) {
			this.setState({
				startDate: date
			});
		}
	}
	handleText(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	async save(e) {
		e.preventDefault();
		const event = {
			title: this.state.title,
			start: moment(this.state.startDate).unix(),
			end: moment(this.state.endDate).unix(),
			location: this.state.location
		};
		try {
			await axios.post('/api/events', {
				event: event
			});
			const message = 'New Event Created Successfully!';
			toast.success(message, {
				position: toast.POSITION.TOP_CENTER
			});
		} catch(error) {
			if (error.response.status === 419) {
				toast.error('Your session has expired. Routing you to login page!', {
					position: toast.POSITION.TOP_CENTER
				});
				setTimeout(() => {
					window.location = window.location.origin + '/login';
				}, 3000);
				return;
			}
			toast.error('Something went wrong. Please try again or contact the Admin!', {
				position: toast.POSITION.TOP_CENTER
			});
		}
	}
	async update(e) {
		e.preventDefault();
		const event = {
			_id: this.state._id,
			_rev: this.state._rev,
			title: this.state.title,
			start: moment(this.state.startDate).unix(),
			end: moment(this.state.endDate).unix(),
			location: this.state.location
		};
		try {
			await axios({
				method: 'put',
				url: `/api/events/${event._id}`,
				data: {
					event: event
				}
			});
			const message = 'Event Updated Successfully!';
			toast.success(message, {
				position: toast.POSITION.TOP_CENTER
			});
		} catch(error) {
			if (error.response.status === 419) {
				toast.error('Your session has expired. Routing you to login page!', {
					position: toast.POSITION.TOP_CENTER
				});
				setTimeout(() => {
					window.location = window.location.origin + '/login';
				}, 3000);
				return;
			}
			toast.error('Something went wrong. Please try again or contact the Admin!', {
				position: toast.POSITION.TOP_CENTER
			});
		}
	}

	render() {
		return (
			<BrowserRouter>
				<div>
					<ToastContainer />
					<div>
						<Link className='btn' to="/calendar/index">Back to Calendar</Link>
					</div>
					<div>
						<form>
							<div>
								<h2>Create Event</h2>
								<div className='row form-group'>
									<div className='col-xs-1'>
										<span>Title</span>
									</div>
									<div className='col-xs-6'>
										<input value={this.state.title} onChange={this.handleText}
											name='title'/>
									</div>
								</div>
								<div className='row form-group'>
									<div className='col-xs-1'>
										<span>Start</span>
									</div>
									<div className='col-xs-6'>
										<DatePicker
											selected={this.state.startDate}
											onChange={this.handleStartDateChange}
											showTimeSelect
											timeFormat="HH:mm"
											timeIntervals={15}
											dateFormat="MMMM d, yyyy h:mm aa"
											timeCaption="time">
										</DatePicker>
									</div>
								</div>
								<div className='row form-group'>
									<div className='col-xs-1'>
										<span>End</span>
									</div>
									<div className='col-xs-6'>
										<DatePicker
											selected={this.state.endDate}
											onChange={this.handleEndDateChange}
											showTimeSelect
											timeFormat="HH:mm"
											timeIntervals={15}
											dateFormat="MMMM d, yyyy h:mm aa"
											timeCaption="time">
										</DatePicker>
									</div>
								</div>
								<div className='row form-group'>
									<div className='col-xs-1'>
										<span>Venue</span>
									</div>
									<div className='col-xs-6'>
										<input value={this.state.location} onChange={this.handleText}
											name='location'/>
									</div>
								</div>
								<div>
									<button
										className='btn btn-primary button-gen-layout'
										onClick={this.state.isEditScreen ? this.update : this.save}>
										{this.state.isEditScreen ? 'Update' : 'Save'}
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

export default EditEvent;