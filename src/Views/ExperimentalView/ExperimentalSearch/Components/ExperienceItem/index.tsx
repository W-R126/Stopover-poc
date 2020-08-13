import React from 'react';
import css from './ExperienceItem.module.css';
import SunImg from '../../../../../Assets/Images/Experimental/Sun.svg';

interface ExperienceItemProps {
  title: string;
  subTitle: string;
  description?: string;
  climate?: string;
  srcImg: string;
}

export default function ExperienceItem({
  title,
  subTitle,
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
        <div className={css.From}>
          {subTitle}
        </div>
        {description && <div className={css.Description}>{description}</div>}
        <div className={css.Footer}>
          { climate && (
            <>
              <img src={SunImg} alt="sun" />
              {climate}
            </>
          )}
          <div className={css.TellMe} role="button">
            {'Tell me more >'}
          </div>
        </div>
      </div>
    </div>
  );
}
