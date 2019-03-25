import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';

class EditEvent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<BrowserRouter>
				<div>
					<div>
						<Link className='btn' to="/calendar/index">Back to Calendar</Link>
					</div>
					<div>
						hey!!!
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

export default EditEvent;