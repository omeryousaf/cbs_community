import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { spacing } from '@material-ui/system';
import * as moment from 'moment';

const StyledDiv = styled.div`${spacing}`;

class EventOverlay extends React.Component {
	constructor(props) {
		super(props);
		this.goToEventEditScreen = this.goToEventEditScreen.bind(this);
	}

	goToEventEditScreen() {
		this.props.close();
		window.location = '/calendar/event';
	}

	render() {
		return(
			<Dialog
				open = {this.props.open}
				onClose = {this.props.close}
			>
				<DialogTitle align='center'>
					<span style={{ fontSize: '1.5em'}}>{'Event Summary'}</span>
				</DialogTitle>
				<DialogContent>
					<StyledDiv mb={1}>
						<DialogContentText display='inline' variant='h5'>Title: </DialogContentText>
						<DialogContentText display='inline' color='textPrimary' variant='h5'>
							{this.props.event.title}
						</DialogContentText>
					</StyledDiv>
					<StyledDiv mb={1}>
						<DialogContentText display='inline' variant='h5'>Start: </DialogContentText>
						<DialogContentText display='inline' color='textPrimary' variant='h5'>
							{moment(this.props.event.start).format('DD MMM YYYY @ hh:mm a')}
						</DialogContentText>
					</StyledDiv>
					<StyledDiv mb={1}>
						<DialogContentText display='inline' variant='h5'>End: </DialogContentText>
						<DialogContentText display='inline' color='textPrimary' variant='h5'>
							{moment(this.props.event.end).format('DD MMM YYYY @ hh:mm a')}
						</DialogContentText>
					</StyledDiv>
					<StyledDiv mb={1}>
						<DialogContentText display='inline' variant='h5'>Location: </DialogContentText>
						<DialogContentText display='inline' color='textPrimary' variant='h5'>
							{this.props.event.location}
						</DialogContentText>
					</StyledDiv>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.goToEventEditScreen} color="primary" style={{ fontSize: '1em'}}>
            Edit
          </Button>
				</DialogActions>
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