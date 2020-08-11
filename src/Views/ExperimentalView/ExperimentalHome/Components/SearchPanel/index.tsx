import React from 'react';

import css from 'SearchPanel.module.css';

interface SearchPanelProps {
  data: any;
}

interface SearchPanelState {
  selectedPane: string;
}

class SearchPanel extends React.Component<
  SearchPanelProps, SearchPanelState
> {
  constructor(props: SearchPanelProps) {
    super(props);
    this.state = {
      selectedPane: 'FLIGHTS',
    };
  }

  render(): JSX.Element {
    return (
      <div className={css.ComponentContainer} />
    );
  }
}

export default SearchPanel;
