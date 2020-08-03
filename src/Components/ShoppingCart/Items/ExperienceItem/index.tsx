import React from 'react';

import css from './ExperienceItem.module.css';
import shoppingCartCss from '../../ShoppingCart.module.css';
import raffleIcon from '../../../../Assets/Images/raffles.svg';
import { ShoppingCartItemProps } from '../..';
import { ExperienceDateModel } from '../../../../Models/ExperienceDateModel';
import ContentService from '../../../../Services/ContentService';
import Utils from '../../../../Utils';

interface ExperienceItemProps extends ShoppingCartItemProps<ExperienceDateModel[]> {
  contentService: ContentService;
}

export default function ExperienceItem({
  item: experiences,
  className,
  contentService,
  detailed,
  style,
  currency,
  price,
}: ExperienceItemProps): JSX.Element {
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

  if (detailed) {
    return (
      <div
        className={[css.ExperienceItemDetailed, shoppingCartCss.Item, className].join(' ')}
        style={style}
      >
        <strong className={css.Pricing}>
          {price === 0
            ? 'FREE'
            : `${currency} ${Utils.formatCurrency(price)}`}
        </strong>

        {experiences.map((experienceDate, idx) => (
          experienceDate.experiences.map((experience, idx2) => (
            <React.Fragment key={`experience-${idx}-${idx2}`}>
              <strong>
                {experience.experience.title}
              </strong>

              <span>
                {experienceDate.date.toLocaleDateString(
                  contentService.locale,
                  { month: 'long', day: 'numeric', year: 'numeric' },
                )}
              </span>

              <span>
                {`${experience.guests} ${experience.guests === 1 ? 'guest' : 'guests'}`}
              </span>

              <span className={css.ExperiencePrice}>
                {`${experience.experience.pricing[0].price.currency} ${
                  Utils.formatCurrency(
                    experience.experience.pricing[0].price.total * experience.guests,
                  )}`}
              </span>
            </React.Fragment>
          )).flat()
        ))}
      </div>
    );
  }

  return (
    <div className={[css.ExperienceItem, shoppingCartCss.Item, className].join(' ')}>
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
