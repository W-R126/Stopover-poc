import React from 'react';

import css from './ExperienceItem.module.css';
import shoppingCartCss from '../../ShoppingCart.module.css';
import raffleIcon from '../../../../Assets/Images/raffles.svg';
import { ShoppingCartItemProps } from '../..';
import { ExperienceDateModel } from '../../../../Models/ExperienceDateModel';
import ContentService from '../../../../Services/ContentService';

interface ExperienceItemProps extends ShoppingCartItemProps<ExperienceDateModel[]> {
  contentService: ContentService;
}

export default function ExperienceItem({
  item: experiences,
  className,
  contentService,
}: ExperienceItemProps): JSX.Element {
  const classList = [css.ExperienceItem, shoppingCartCss.Item];

  if (className) {
    classList.push(className);
  }

  const startDate = experiences[0]?.date;
  const endDate = experiences[experiences.length - 1]?.date;

  let dateStr = `${startDate?.toLocaleDateString(
    contentService.locale,
    { month: 'long', day: 'numeric' },
  )}`;

  if (startDate?.valueOf() !== endDate?.valueOf()) {
    dateStr += ` - ${endDate?.toLocaleDateString(
      contentService.locale,
      { month: 'long', day: 'numeric' },
    )}`;
  }

  const totalExperiences = experiences.reduce((prev, curr) => prev + curr.experiences.length, 0);

  return (
    <div className={classList.join(' ')}>
      <img src={raffleIcon} alt="Flight" className={css.Icon} />

      <div className={css.Info}>
        <strong>
          {dateStr}
        </strong>

        <span>
          {`${totalExperiences} ${totalExperiences === 1 ? 'Experience' : 'Experiences'}`}
        </span>
      </div>
    </div>
  );
}
