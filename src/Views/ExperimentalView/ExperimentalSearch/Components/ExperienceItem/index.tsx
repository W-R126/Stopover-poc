import React from 'react';
import css from './ExperienceItem.module.css';

import SunImg from '../../../../../Assets/Images/Experimental/Sun.svg';
import ChevRightSvg from '../../../../../Assets/Images/Experimental/ChevRight.svg';

interface ExperienceItemProps {
  title: string;
  subTitle?: string;
  duration?: string;
  description?: string;
  climate?: string;
  srcImg: string;
}

export default function ExperienceItem({
  title,
  subTitle,
  duration,
  description,
  climate,
  srcImg,
}: ExperienceItemProps): JSX.Element {
  return (
    <div
      className={css.ComponentContainer}
    >
      <div className={css.Content}>
        <img className={css.Back} src={srcImg} alt="back" />
        <div className={css.Cover} />
        <div className={css.Title}>{title}</div>
        {duration && <div className={css.Duration}>{duration}</div>}
        {subTitle && <div className={css.From}>{subTitle}</div>}
        {description && <div className={css.Description}>{description}</div>}
        <div className={css.Footer}>
          { climate && (
            <>
              <img src={SunImg} alt="sun" />
              {climate}
            </>
          )}
          <div className={css.TellMe} role="button">
            Tell me more
            <img src={ChevRightSvg} alt="Chev Right" />
          </div>
        </div>
      </div>
    </div>
  );
}
