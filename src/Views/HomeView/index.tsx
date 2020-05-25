import React from 'react';

import './HomeView.css';
import ContentService from '../../Services/ContentService';
import TripSearch from '../../Components/TripSearch';

interface HomeViewProps {
  contentService: ContentService;
}

export default class HomeView extends React.Component<HomeViewProps, {}> {
  constructor(props: HomeViewProps) {
    super(props);

    this.state = {};
  }

  render(): JSX.Element {
    const { contentService } = this.props;

    return (
      <section className="home-view">
        <div className="view-top-image" />
        <div className="content-wrapper">
          <TripSearch contentService={contentService} />
        </div>
      </section>
    );
  }
}
