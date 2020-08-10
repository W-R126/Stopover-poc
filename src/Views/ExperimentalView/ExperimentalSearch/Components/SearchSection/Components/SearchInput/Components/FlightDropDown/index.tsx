import React from 'react';
import css from './FlightDropDown.module.css';
import ContentService from '../../../../../../../../../Services/ContentService';
import DateSelector from './Components/DateSelector';
import PassengerSelector from './Components/PassengerSelector';
import { GuestsModel } from '../../../../../../../../../Models/GuestsModel';

interface FlightDropDownProps {
  flightData: any;
  contentService: ContentService;
  changeDate: Function;
  changePassenger: Function;
  setShowDropDown: Function;
}

export default function FlightDropDown({
  flightData, contentService, changeDate, changePassenger, setShowDropDown,
}: FlightDropDownProps): JSX.Element {
  return (
    <div className={css.ComponentContainer}>
      <div className={css.TopContainer}>
        <div className={css.Title}>{flightData.title}</div>
        <DateSelector
          dateInfo={flightData.content.dateRange}
          contentService={contentService}
          changeDate={(dateInfo: any): void => changeDate(dateInfo)}
          setShowDropDown={setShowDropDown}
        />
        <PassengerSelector
          data={flightData.content.passenger}
          onChange={(passengers: GuestsModel): void => {
            changePassenger(passengers);
          }}
        />
      </div>
    </div>
  );
}
