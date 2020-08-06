import React from 'react';
import css from './SearchSection.module.css';

import MicImg from '../../../../Assets/Images/Experimental/Mic.svg';
import MicWhiteImg from '../../../../Assets/Images/Experimental/Mic-White.svg';
import CloseImg from '../../../../Assets/Images/Experimental/Close.svg';

interface SearchSectionProps {
  isSearch: boolean;
}

interface SearchSectionState {
  status: number; // 0: normal, 1: searching
}

export default class SearchSection extends React.Component<SearchSectionProps, SearchSectionState> {
  private readonly STATUS_NORMAL = 0;

  private readonly STATUS_SEARCHING = 1;

  constructor(props: SearchSectionProps) {
    super(props);
    this.state = {
      status: this.STATUS_NORMAL,
    };
    this.clickRecord = this.clickRecord.bind(this);
    this.clickRecordCancel = this.clickRecordCancel.bind(this);
  }

  private clickRecord(): void {
    this.setState({
      status: this.STATUS_SEARCHING,
    });
  }

  private clickRecordCancel(): void {
    this.setState({
      status: this.STATUS_NORMAL,
    });
  }

  render(): JSX.Element {
    const { status } = this.state;
    const containerClassList = [css.SearchContainer];
    if (status === this.STATUS_NORMAL) {
      containerClassList.push(css.SearchBack);
    } else if (status === this.STATUS_SEARCHING) { containerClassList.push(css.RecordBack); }

    return (
      <div className={containerClassList.join(' ')}>
        <div className={css.Container}>
          { status === this.STATUS_NORMAL && (
            <>
              <div className={css.Question}>
                Hey John, how can we help you today?
              </div>
              <div className={css.SearchInput}>
                <input
                  type="text"
                  value="I want to book a ticket from Abu Dhabi to New York"
                />
                <div
                  className={css.InputMic}
                  role="button"
                  onClick={(): void => { this.clickRecord(); }}
                >
                  <img src={MicImg} alt="Mic" />
                </div>
              </div>
            </>
          )}
          { status === this.STATUS_SEARCHING && (
            <>
              <div className={css.RecordQuestion}>Hey John, how can we help you today?</div>
              <div className={css.MicButtonContainer}>
                <div className={css.SpinnerContainer}>
                  <div className={css.Spinner}>
                    <div className={css.DoubleBounce1} />
                    <div className={css.DoubleBounce2} />
                  </div>
                </div>
                <div className={css.MicButton} role="button">
                  <img src={MicWhiteImg} alt="Mic" />
                </div>
              </div>
              <div
                className={css.CloseButton}
                role="button"
                onClick={() => {
                  this.clickRecordCancel();
                }}
              >
                <img src={CloseImg} alt="Close" />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
