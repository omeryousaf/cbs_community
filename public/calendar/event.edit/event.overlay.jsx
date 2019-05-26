import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import * as moment from 'moment';


class EventOverlay extends React.Component {
	render() {
		return(
			<Dialog
				open = {this.props.open}
				onClose = {this.props.close}
			>
				<DialogTitle>{"Event Summary"}</DialogTitle>
				<DialogContent>
					<div>
						<span>Title: </span>
						<DialogContentText display='inline'>
							{this.props.event.title}
						</DialogContentText>
					</div>
					<div>
						<span>Start: </span>
						<DialogContentText display='inline'>
							{moment(this.props.event.start).format('DD MMM YYYY @ hh:mm a')}
						</DialogContentText>
					</div>
					<div>
						<span>End: </span>
						<DialogContentText display='inline'>
							{moment(this.props.event.end).format('DD MMM YYYY @ hh:mm a')}
						</DialogContentText>
					</div>
					<div>
						<span>Location: </span>
						<DialogContentText display='inline'>
							{this.props.event.location}
						</DialogContentText>
					</div>

				</DialogContent>
			</Dialog>
			);
	}
}

EventOverlay.propTypes = {
	open: PropTypes.bool,
	close: PropTypes.func,
	event: PropTypes.shape({
		title: PropTypes.string,
		start: PropTypes.instanceOf(Date),
		end: PropTypes.instanceOf(Date),
		location: PropTypes.string
	})
};

export default EventOverlay;