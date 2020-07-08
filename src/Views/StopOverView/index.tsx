import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import commonCss from '../../common.module.css';
import css from './StopOverView.module.css';
import Button from '../../Components/UI/Button';
import Hotels from './Steps/Hotels';
import Experiences from './Steps/Experiences';
import Inbound from './Steps/Inbound';

export default function StopOverView(): JSX.Element {
  const history = useHistory();
  const { progressStep } = useParams<{ progressStep: 'hotels' | 'experiences' | 'inbound' }>();

  const hotelsClassList = [css.Step];
  const experiencesClassList = [css.Step];
  const inboundClassList = [css.Step];
  let backLink;
  let nextFunc;

  switch (progressStep) {
    case 'hotels':
      hotelsClassList.push(css.Active);
      nextFunc = (): void => history.push('/stopover/experiences');
      break;
    case 'experiences':
      backLink = (<Link to="/stopover/hotels">Back to hotels and onward flight</Link>);
      nextFunc = (): void => history.push('/stopover/inbound');
      hotelsClassList.push(css.Done);
      experiencesClassList.push(css.Active);
      break;
    case 'inbound':
      backLink = (<Link to="/stopover/experiences">Back to experiences</Link>);
      hotelsClassList.push(css.Done);
      experiencesClassList.push(css.Done);
      inboundClassList.push(css.Active);
      break;
    default:
      break;
  }

  return (
    <div className={css.StopOverView}>
      <div className={css.Progress}>
        <div className={`${commonCss.ContentWrapper} ${css.ContentWrapper}`}>
          <span className={css.NavigateBack}>
            {backLink}
          </span>

          <div className={css.StepContainer}>
            <span className={hotelsClassList.join(' ')}>
              <strong>
                1
              </strong>
              <span>Hotel + Onward Flight</span>
            </span>

            <span className={experiencesClassList.join(' ')}>
              <strong>
                2
              </strong>
              <span>Experiences</span>
            </span>

            <span className={inboundClassList.join(' ')}>
              <strong>
                3
              </strong>
              <span>Return Flight</span>
            </span>
          </div>

          {nextFunc && (
            <Button
              type="primary"
              className={css.NavigateForward}
              onClick={nextFunc}
            >
              Next
            </Button>
          )}
        </div>
      </div>

      <div className={`${css.ContentWrapper} ${commonCss.ContentWrapper}`}>
        {progressStep === 'hotels' && (<Hotels />)}
        {progressStep === 'experiences' && (<Experiences />)}
        {progressStep === 'inbound' && (<Inbound />)}
      </div>
    </div>
  );
}
