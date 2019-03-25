import React from 'react';
import { Link } from 'react-router-dom';

class EditEvent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div>
					<Link className='btn' to="/calendar/index">Back to Calendar</Link>
				</div>
				<div>woww!!!!</div>
			</div>
		);
	}
}

export default EditEvent;