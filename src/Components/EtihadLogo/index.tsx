import React from 'react';

import css from './EtihadLogo.module.css';
import englishWordmarkImg from './Images/english-wordmark.svg';
import arabicWordmarkImg from './Images/arabic-wordmark.svg';

interface EtihadLogoProps {
  className?: string;
  showArabicWordmark?: boolean;
  showBrandPlatform?: boolean;
  showEntityName?: boolean;
  brandPlatform?: string;
  entityName?: string;
  brandPlatformAlign?: 'right' | 'bottom';
}

const brandPlatformAligns = {
  right: css.Right,
  bottom: css.Bottom,
};

export default function EtihadLogo({
  className,
  showArabicWordmark,
  showEntityName,
  showBrandPlatform,
  entityName = 'AIRWAYS',
  brandPlatform = 'Choose Well.',
  brandPlatformAlign = 'right',
}: EtihadLogoProps): JSX.Element {
  const classList = [css.EtihadLogo, brandPlatformAligns[brandPlatformAlign]];

  if (className) {
    classList.push(className);
  }

  if (showArabicWordmark) {
    classList.push(css.ArabicVisible);
  }

  if (showEntityName) {
    classList.push(css.EntityVisible);
  }

  if (showBrandPlatform) {
    classList.push(css.BrandVisible);
  }

  return (
    <div className={classList.join(' ')}>
      <div className={css.Images}>
        <div className={css.ArabicWordmark}>
          <img src={arabicWordmarkImg} alt="Arabic wordmark" />
        </div>
        <div className={css.EnglishWordmark}>
          <img src={englishWordmarkImg} alt="English wordmark" />
        </div>
        <div className={css.EntityName}>
          <span>
            {entityName}
          </span>
        </div>
      </div>
      <div className={css.BrandPlatform}>
        <span>
          {brandPlatform}
        </span>
      </div>
    </div>
  );
}
