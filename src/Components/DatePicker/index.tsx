import React from 'react';

import './DatePicker.css';

export default class DatePicker extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    this.state = {};
  }

  render(): JSX.Element {
    return (
      <div className="date-picker">
        <div className="outbound">
          <label>Outbound</label>
          <input type="text" id="outbound" placeholder="DD/MMM/YYYY" />
        </div>
        <div className="inbound">
          <label>Inbound</label>
          <input type="text" id="inbound" placeholder="DD/MMM/YYYY" />
        </div>
      </div>
    );
  }
}
