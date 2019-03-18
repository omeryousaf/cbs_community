import React from 'react';
import ReactDOM from 'react-dom';

class CBSReactCalendarApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<h1>hello {this.props.name}!!</h1>);
  }

}

ReactDOM.render(
	<CBSReactCalendarApp name="omer" />,
  document.getElementById('cbs-alumni-calendar-app')
);