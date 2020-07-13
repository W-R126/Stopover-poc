import React from 'react';
import css from './HotelSelection.module.css';
import bed from '../../../../../../Assets/Images/bed.svg';
import { HotelCard } from './Components/HotelCard';
import SortMenu from './Components/SortMenu';
import FilterMenu from './Components/FilterMenu';
import {
  HotelAvailabilityInfos,
  HotelAvailInfo, PropertyType, Amenity,
} from '../../../../../../Services/Responses/ConfirmStopOverResponse';
import Utils from '../../../../../../Utils';
import {
  HOTEL_RATING_RANGE, HOTEL_SORT_RANGE, HOTEL_AMENTITY_RANGE,
  getNetRateOfHotelAvailInfo,
} from '../../Utils';
import ContentService from '../../../../../../Services/ContentService';

interface HotelSelectionProps {
  selectedNight: number;
  hotelAvailabilityInfos?: HotelAvailabilityInfos;
  selectHotel: Function;
  selectedHotelCode: string;
  contentService: ContentService;
}

interface HotelSelectionState {
  sortValue: string;
  filterValue: any;
}

export class HotelSelection extends React.Component<HotelSelectionProps, HotelSelectionState> {
  constructor(props: HotelSelectionProps) {
    super(props);
    this.state = {
      sortValue: HOTEL_SORT_RANGE[0],
      filterValue: {
        hotelClass: HOTEL_RATING_RANGE,
        amentities: [],
        price: -1,
      },
    };
  }

  private getFilterAndSortedHotel(): HotelAvailInfo[] {
    const { hotelAvailabilityInfos } = this.props;
    if (hotelAvailabilityInfos === undefined) { return []; }
    return this.sortHotel(
      this.filterHotel(hotelAvailabilityInfos.hotelAvailInfo),
    );
  }

  private getAmentityCodes(amentityTitle: string): number[] {
    const filteredOne = HOTEL_AMENTITY_RANGE.filter((item) => item.title === amentityTitle);
    if (filteredOne.length > 0) return filteredOne[0].codes;
    return [];
  }

  private getNightDuaration(): string {
    const { contentService, hotelAvailabilityInfos } = this.props;

    const checkInStr = hotelAvailabilityInfos?.checkIn;
    const checkOutStr = hotelAvailabilityInfos?.checkOut;

    if (!(checkInStr && checkOutStr)) {
      return '';
    }

    const startStr = new Date(checkInStr).toLocaleDateString(
      contentService.locale,
      { day: 'numeric', month: 'long' },
    );

    const endStr = new Date(checkOutStr).toLocaleDateString(
      contentService.locale,
      { day: 'numeric', month: 'long' },
    );

    return `${startStr} - ${endStr}`;
  }

  private filterAmentity(amentitiyCodes: number[], amentityArr: Amenity[]): boolean {
    let filtered = false;
    amentityArr.forEach((item: Amenity) => {
      if (filtered) return;
      filtered = (amentitiyCodes.indexOf(item.code) >= 0);
    });
    return filtered;
  }

  private filterPropertyType(amentitiyCodes: number[], propertyArr: PropertyType[]): boolean {
    let filtered = false;
    propertyArr.forEach((item: PropertyType) => {
      if (filtered) return;
      filtered = (amentitiyCodes.indexOf(item.code) >= 0);
    });
    return filtered;
  }

  private filterHotel(hotelList: HotelAvailInfo[]): HotelAvailInfo[] {
    const { filterValue } = this.state;
    let tempList: HotelAvailInfo[] = [];
    if (hotelList === null) { return tempList; }
    if (filterValue.hotelClass.length > 0) {
      tempList = hotelList.filter(
        (item) => filterValue.hotelClass.indexOf(item.hotelInfo.rating) >= 0,
      );
    }

    if (filterValue.amentities.length > 0) {
      tempList = tempList.filter((item: HotelAvailInfo) => {
        let filteredOne = true;
        filterValue.amentities.forEach((amentityTitle: string) => {
          const codes = this.getAmentityCodes(amentityTitle);
          if (!filteredOne) return;
          filteredOne = this.filterPropertyType(
            codes,
            item.hotelInfo.propertyTypeInfo.propertyType,
          );
          filteredOne = this.filterAmentity(
            codes,
            item.hotelInfo.amenities.amenity,
          );
        });
        return filteredOne;
      });
    }

    if (filterValue.price > -1) {
      tempList = tempList.filter(
        (item: HotelAvailInfo) => getNetRateOfHotelAvailInfo(item) < filterValue.price,
      );
    }
    return tempList;
  }

  private sortHotel(hotelList: HotelAvailInfo[]): HotelAvailInfo[] {
    const { sortValue } = this.state;
    return hotelList.sort((a: HotelAvailInfo, b: HotelAvailInfo) => {
      if (sortValue === 'Recommended') {
        if (a.hotelInfo?.recommended) return -1;
        if (b.hotelInfo?.recommended) return 1;
        return 0;
      } if (sortValue === 'Lowest price') {
        const aNetRate = getNetRateOfHotelAvailInfo(a);
        const bNetRate = getNetRateOfHotelAvailInfo(b);
        return aNetRate - bNetRate;
      } if (sortValue === 'Highest price') {
        const aNetRate = getNetRateOfHotelAvailInfo(a);
        const bNetRate = getNetRateOfHotelAvailInfo(b);
        return bNetRate - aNetRate;
      } if (sortValue === 'Hotel Class') {
        return parseInt(b.hotelInfo.rating, 0) - parseInt(a.hotelInfo.rating, 0);
      } if (sortValue === 'Check-in time') {
        const filteredA = a.hotelInfo.amenities?.amenity.filter((item) => item.description?.toLowerCase() === 'check-in hour');
        const filteredB = b.hotelInfo.amenities?.amenity.filter((item) => item.description?.toLowerCase() === 'check-in hour');
        const aValue = filteredA.length > 0 ? filteredA[0].value : '00:00:00';
        const bValue = filteredB.length > 0 ? filteredB[0].value : '00:00:00';
        return Utils.compareCheckIn(aValue, bValue);
      }
      return 0;
    });
  }

  render(): JSX.Element {
    const { sortValue, filterValue } = this.state;
    const {
      selectedNight, selectHotel, selectedHotelCode,
    } = this.props;
    return (
      <div className={css.LeftWrap}>
        <div className={css.HotelTop}>
          <img src={bed} alt="" />
          <p>Select a hotel</p>
          <p className={css.DayDuaration}>{this.getNightDuaration()}</p>
        </div>
        <div className={css.FilterWrap}>
          <FilterMenu
            filterValue={filterValue}
            changeFilter={(selectedFilter: any): void => {
              this.setState({
                filterValue: { ...selectedFilter },
              });
            }}
          />
          <SortMenu
            selectedSort={sortValue}
            changeSort={(selectedOne: string): void => {
              this.setState({ sortValue: selectedOne });
            }}
          />
        </div>
        <div className={css.InnerScrollWrap}>
          {this.getFilterAndSortedHotel().map((item, index) => (
            <div key={index}>
              <HotelCard
                {...item}
                selectHotel={(hotelCode: string): void => { selectHotel(hotelCode); }}
                selectedNight={selectedNight}
                selectedHotelCode={selectedHotelCode}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
