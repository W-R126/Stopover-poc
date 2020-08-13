import React from 'react';

import css from './InfoItem.module.css';

import SunSvg from '../../../../../Assets/Images/Experimental/Sun.svg';

interface InfoItemProps {
  title: string;
  description?: string;
  climate?: string;
  duration?: string;
  tellMe?: boolean;
  learnMore?: boolean;
  srcImg: string;
  style?: Record<string, any>;
}

export default function InfoItem({
  title,
  description,
  climate,
  duration,
  tellMe,
  learnMore,
  srcImg,
  style,
}: InfoItemProps): JSX.Element {
  return (
    <div className={css.ComponentContainer} style={style}>
      <img className={css.Back} src={srcImg} alt="Back" />
      <div className={css.Title}>{title}</div>
      {duration && <div className={css.Duration}>{duration}</div>}
      {description && <div className={css.Description}>{description}</div>}
      {learnMore && <div className={css.LearnMore}>Learn more</div>}

      <div className={css.Footer}>
        {climate && (
          <div className={css.Climate}>
            <img src={SunSvg} alt="Sun" />
            {climate}
          </div>
        )}
        {tellMe && <div className={css.TellMe}>{'Tell me more >'}</div>}
      </div>
    </div>
  );
}
