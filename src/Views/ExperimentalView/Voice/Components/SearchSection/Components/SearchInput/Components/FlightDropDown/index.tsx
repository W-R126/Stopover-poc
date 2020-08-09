import React from 'react';
import css from './FlightDropDown.module.css';
import ContentService from '../../../../../../../../../Services/ContentService';
import DateSelector from './Components/DateSelector';

interface FlightDropDownProps {
  flightData: any;
  contentService: ContentService;
  changeDate: Function;
}

export default function FlightDropDown({
  flightData, contentService, changeDate,
}: FlightDropDownProps): JSX.Element {
  return (
    <div className={css.ComponentContainer}>
      <div className={css.TopContainer}>
        <div className={css.Title}>{flightData.title}</div>
        <DateSelector
          dateInfo={flightData.content.dateRange}
          contentService={contentService}
          changeDate={(dateInfo: any): void => changeDate(dateInfo)}
        />
      </div>
    </div>
  );
}
