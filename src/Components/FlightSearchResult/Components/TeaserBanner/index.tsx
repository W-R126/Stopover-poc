import React from 'react';
import css from './TeaserBanner.module.css';
import LocationSvg from '../../../../Assets/Images/teaser-locaion.svg';
import { CustomerSegmentationModel } from '../../../../Models/CustomerSegmentMappingModel';

interface TeaserBannerProps {
  mapCustomerSegment: CustomerSegmentationModel;
}

export default function TeaserBanner({ mapCustomerSegment }: TeaserBannerProps): JSX.Element {
  const getSelectedImg = () => {
    switch (mapCustomerSegment.UIMapping) {
      case 'BUSINESS':
        return css.BannerImg1;
      case 'LEISURE':
        return css.BannerImg2;
      case 'FAMILY':
        return css.BannerImg3;
      default: return css.BannerImg3;
    }
  };

  const getMainTitle = () => {
    switch (mapCustomerSegment.UIMapping) {
      case 'BUSINESS':
        return 'These flights involve a layover in Abu Dhabi!';
      case 'LEISURE':
        return 'These flights involve a layover in Abu Dhabi! ';
      case 'FAMILY':
        return 'These flights involve a layover in Abu Dhabi!';
      default: return 'These flights involve a layover in Abu Dhabi!';
    }
  };

  const getDescription = () => {
    switch (mapCustomerSegment.UIMapping) {
      case 'BUSINESS':
        return 'Why not stay a few days and discover the UAE’s capital city? We’ve got some amazing deals on hotels and experiences';
      case 'LEISURE':
        return 'Why not stay a few days and discover the UAE’s capital city? We’ve got some amazing deals on hotels and experiences';
      case 'FAMILY':
        return 'Why not stay a few days and discover the UAE’s capital city? We’ve got some amazing deals on hotels and experiences';
      default: return 'Why not stay a few days and discover the UAE’s capital city? We’ve got some amazing deals on hotels and experiences';
    }
  };

  const getFooterStr = () => {
    switch (mapCustomerSegment.UIMapping) {
      case 'BUSINESS':
        return 'Relax and enjoy an afternoon of golf at Saadiyat Beach Golf Club.';
      case 'LEISURE':
        return 'Soak up the sun at Saadiyat Beach Club. We have great offers for couples!';
      case 'FAMILY':
        return 'Fun for the whole family at Warner Bros World, Abu Dhabi.';
      default: return 'Relax and enjoy an afternoon of golf at Saadiyat Beach Golf Club.';
    }
  };

  return (
    <div className={css.ComponetContainer}>
      <div className={`${css.BannerBack} ${getSelectedImg()}`} />
      <div className={css.Overlay} />
      <div className={css.MainTitle}>
        <strong>{getMainTitle()}</strong>
      </div>
      <div className={css.Description}>
        {getDescription()}
      </div>
      <div className={css.Footer}>
        <img src={LocationSvg} alt="Location" />
        {getFooterStr()}
      </div>
    </div>
  );
}
