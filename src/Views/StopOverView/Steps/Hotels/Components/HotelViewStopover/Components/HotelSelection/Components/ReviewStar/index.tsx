import React from 'react';
import css from './ReviewStar.module.css';
import Star from '../../../../../../../../../../Assets/Images/stars.svg';
import { Review } from '../../../../../../../../../../Services/Responses/ConfirmStopOverResponse';

interface ReviewStarProps {
  reviews: Review[];
}

export default class ReviewStar extends React.Component<ReviewStarProps, {}> {
  private calculateReview(): string {
    const { reviews } = this.props;
    let totalCount = 0;
    let totalValue = 0;
    reviews.forEach((item) => {
      totalCount += item.reviewCount;
      totalValue += item.reviewCount * item.rate;
    });
    return `${(totalValue / totalCount / 5) * 100}%`;
  }

  render(): JSX.Element {
    return (
      <div className={css.RevewStarContainer}>
        <div className={css.starContainer} style={{ width: this.calculateReview() }}>
          <img src={Star} alt="Review Star" />
        </div>
      </div>
    );
  }
}
