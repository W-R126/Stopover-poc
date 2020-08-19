import React from 'react';
import css from './SearchSection.module.css';

import MicWhiteImg from '../../../../../Assets/Images/Experimental/Mic-White.svg';
import CloseImg from '../../../../../Assets/Images/Experimental/Close.svg';
import SpinnerSvg from '../../../../../Assets/Images/Experimental/Spinner.svg';

import SearchInput from './Components/SearchInput';
import ContentService from '../../../../../Services/ContentService';

interface SearchSectionProps {
  contentService: ContentService;
  selectedData: any;
  onChange: (newData: any) => void;
}

interface SearchSectionState {
  recordStatus: number; // 0: normal, 1: searching, 2: result
  questionStep: number;
}

export default class SearchSection extends React.Component<
  SearchSectionProps, SearchSectionState
> {
  private readonly STATUS_NORMAL = 0;

  private readonly STATUS_SEARCH = 1;

  private readonly STATUS_RECORDING = 2;

  private readonly STATUS_RESPONSE_WAITING = 3;

  private readonly STATUS_RESULT = 4;

  private readonly QUEST_ARRAY = [
    'What is the baggage allowance in economy flex?',
  ]

  constructor(props: SearchSectionProps) {
    super(props);
    this.state = {
      recordStatus: this.STATUS_NORMAL,
      questionStep: 0,
    };
    this.clickSearch = this.clickSearch.bind(this);
    this.clickRecordCancel = this.clickRecordCancel.bind(this);
    this.startRrecord = this.startRrecord.bind(this);
    this.responseWaiting = this.responseWaiting.bind(this);
    this.restartSearch = this.restartSearch.bind(this);
  }

  private clickSearch(): void {
    this.setState({
      recordStatus: this.STATUS_SEARCH,
      questionStep: 0,
    });
  }

  private startRrecord(): void {
    this.setState({
      recordStatus: this.STATUS_RECORDING,
      questionStep: 0,
    });

    setTimeout(() => {
      const { recordStatus } = this.state;
      if (recordStatus === this.STATUS_NORMAL) { return; }
      this.responseWaiting();
    }, 2000);
  }

  private clickRecordCancel(): void {
    this.setState({
      recordStatus: this.STATUS_NORMAL,
    });
  }

  private responseWaiting(): void {
    const { questionStep } = this.state;

    this.setState({
      recordStatus: this.STATUS_RESPONSE_WAITING,
    });

    setTimeout(() => {
      const { recordStatus } = this.state;

      if (recordStatus === this.STATUS_NORMAL) { return; }
      if (questionStep === this.QUEST_ARRAY.length - 1) {
        this.setState({
          recordStatus: this.STATUS_RESULT,
        });
      } else {
        this.setState({
          recordStatus: this.STATUS_SEARCH,
          questionStep: questionStep + 1,
        });
      }
    }, 2000);
  }

  private restartSearch(): void {
    this.setState({
      recordStatus: this.STATUS_SEARCH,
      questionStep: 0,
    });
  }

  private renderRecord(): JSX.Element|null {
    const { recordStatus, questionStep } = this.state;
    if (recordStatus === this.STATUS_SEARCH
      || recordStatus === this.STATUS_RECORDING
      || recordStatus === this.STATUS_RESPONSE_WAITING
    ) {
      return (
        <>
          <div className={css.RecordQuestion}>
            {recordStatus === this.STATUS_RESPONSE_WAITING && this.QUEST_ARRAY[questionStep]}
          </div>
          <div className={css.MicButtonContainer}>
            {recordStatus === this.STATUS_SEARCH && (
            <>
              <div
                className={css.MicButton}
                role="button"
                onClick={(): void => {
                  this.startRrecord();
                }}
              >
                <img src={MicWhiteImg} alt="Mic" />
              </div>
            </>
            )}
            {recordStatus === this.STATUS_RECORDING && (
            <>
              <div className={css.SpinnerContainer}>
                <div className={css.Spinner}>
                  <div className={css.DoubleBounce1} />
                  <div className={css.DoubleBounce2} />
                </div>
              </div>
              <div className={css.MicButton} role="button">
                <img src={MicWhiteImg} alt="Mic" />
              </div>
            </>
            )}
            {recordStatus === this.STATUS_RESPONSE_WAITING && (
              <img src={SpinnerSvg} alt="spinner" />
            )}
          </div>
          <div
            className={css.CloseButton}
            role="button"
            onClick={(): void => {
              this.clickRecordCancel();
            }}
          >
            <img src={CloseImg} alt="Close" />
          </div>
        </>
      );
    } if (recordStatus === this.STATUS_RESULT) {
      return (
        <>
          <div className={css.ResultText}>
            The baggage allowance in economy flex is:
            {' '}
            <strong>35kg</strong>
          </div>
          <div className={css.MicButtonContainer}>
            <div
              className={css.MicButton}
              role="button"
              onClick={(): void => {
                this.restartSearch();
              }}
            >
              <img src={MicWhiteImg} alt="Mic" />
            </div>
          </div>
          <div
            className={css.CloseButton}
            role="button"
            onClick={(): void => {
              this.clickRecordCancel();
            }}
          >
            <img src={CloseImg} alt="Close" />
          </div>
        </>
      );
    }
    return null;
  }

  render(): JSX.Element {
    const { recordStatus } = this.state;
    const { contentService, selectedData, onChange } = this.props;

    const containerClassList = [css.SearchContainer];
    if (recordStatus === this.STATUS_NORMAL) {
      containerClassList.push(css.SearchBack);
    } else if (recordStatus === this.STATUS_RESULT) {
      containerClassList.push(css.ResultBack);
    } else { containerClassList.push(css.RecordBack); }

    return (
      <div className={containerClassList.join(' ')}>
        <div className={css.Container}>
          { recordStatus === this.STATUS_NORMAL ? (
            <>
              <div className={css.Question}>
                Hey John, how can we help you today?
              </div>
              <SearchInput
                clickMic={this.startRrecord}
                contentService={contentService}
                selectedData={selectedData}
                onChange={onChange}
              />
            </>
          ) : (
            this.renderRecord()
          )}
        </div>
      </div>
    );
  }
}
