import React from 'react';
import css from './Loading.module.css';
import LoadingSpinner from '../../../../../../Assets/Images/NDC/loading-spinner.svg';
import LoadingImg1 from '../../../../../../Assets/Images/NDC/loading1.png';
import LoadingImg2 from '../../../../../../Assets/Images/NDC/loading2.png';

interface LoadingState {
  curView: number;
}

export default class Loading extends React.Component<{}, LoadingState> {
  private Loading_Img = [LoadingImg1, LoadingImg2];

  private Loading_Str = [
    'Did you know that Finland has almost 180,000 islands. More than any country on earth.',
    'Did you know that Finland has almost 180,000 islands. More than any country on earth.',
    'Did you know that Finland has almost 180,000 islands. More than any country on earth.',
    'Every penny thrown into Rome’s Trevi Fountain is collected every day and donated to charities.',
    'Every penny thrown into Rome’s Trevi Fountain is collected every day and donated to charities.',
    'Every penny thrown into Rome’s Trevi Fountain is collected every day and donated to charities.',
    'Every penny thrown into Rome’s Trevi Fountain is collected every day and donated to charities.',
    'Every penny thrown into Rome’s Trevi Fountain is collected every day and donated to charities.',
  ];

  private interval: any;

  constructor(props: any) {
    super(props);
    this.state = {
      curView: 0,
    };
    this.timer = this.timer.bind(this);
  }

  componentDidMount(): void {
    this.interval = setInterval(this.timer, 2000);
  }

  componentWillUnmount(): void {
    clearInterval(this.interval);
  }

  private timer(): void {
    let { curView } = this.state;
    curView += 1;
    if (curView >= 8) curView = 0;

    this.setState({
      curView,
    });
  }

  render(): JSX.Element {
    const { curView } = this.state;
    return (
      <>
        <div className={css.LoadingHeader}>
          <p>Creating your package</p>
          <img src={LoadingSpinner} alt="loading spinner" />
        </div>
        <div className={css.PanelBody}>
          <img
            src={curView <= 2 ? this.Loading_Img[0] : this.Loading_Img[1]}
            alt="panel back"
          />
          <div className={css.Description}>{this.Loading_Str[curView]}</div>
        </div>
      </>
    );
  }
}
