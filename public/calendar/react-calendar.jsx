import React from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from 'fullcalendar-reactwrapper';
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css';

class CBSReactCalendarApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			events:[{
				title: 'All Day Event',
				start: '2019-03-15'
			}, {
				title: 'Long Event',
				start: '2019-03-16',
				end: '2019-03-18'
			}]
    }
  }

  render() {
    return (
			<div id="cbs-cal-component">
				<FullCalendar
					id = "your-custom-ID"
					header = {{
						left: 'prev,next today myCustomButton',
						center: 'title',
						right: 'month,basicWeek,basicDay'
					}}
					navLinks= {true} // can click day/week names to navigate views
					editable= {true}
					eventLimit= {true} // allow "more" link when too many events
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