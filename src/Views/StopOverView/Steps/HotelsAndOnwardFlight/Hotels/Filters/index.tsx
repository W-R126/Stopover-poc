import React, { useState, useEffect, useMemo } from 'react';

import Menu from '../../../../../../Components/UI/Menu';

import css from './Filters.module.css';
import { HotelModel, getCheapestHotelPrice, getMostExpensiveHotelPrice } from '../../../../../../Models/HotelOfferModel';
import RangeSlider from '../../../../../../Components/UI/RangeSlider';
import Utils from '../../../../../../Utils';
import Checkbox from '../../../../../../Components/UI/Checkbox';

export type FilterFunc = (hotel: HotelModel) => boolean;

interface FiltersProps {
  className?: string;
  currency: string;
  hotels: HotelModel[];
  onChange: (filterFunc: FilterFunc) => void;
}

let throttle = new Date();
let finalCall: Promise<unknown>;

const amenityLabels: { [key: string]: string } = {
  airConditioning: 'Air conditioning',
  freeInternet: 'Free internet',
  pool: 'Pool',
  freeBreakfast: 'Free breakfast',
  kidFriendly: 'Kid-friendly',
  petFriendly: 'Pet-friendly',
  bar: 'Bar',
  restaurant: 'Restaurant',
  spa: 'Spa',
};

const hotelAmenityLabels: { [key: string]: string[] } = {
  airConditioning: [
    'Individually adjustable air conditioning',
    'Centrally regulated air conditioning',
    'Air conditioning in public areas',
    'Air conditioning in Restaurant',
  ],
  freeInternet: ['Internet access', 'Wi-fi'],
  pool: [
    'Private pool',
    'Outdoor freshwater pool',
    'Outdoor heated pool',
    'Outdoor swimming pool',
    'Indoor heated pool',
  ],
  freeBreakfast: [
    'Breakfast',
  ],
  kidFriendly: [
    'Kids’ club',
    'Children’s swimming area',
  ],
  petFriendly: [
    'Small pets allowed (under 5 kg)',
    'Large pets allowed (over 5 kg)',
  ],
  bar: ['Bar', 'Swim-up bar'],
  restaurant: ['Restaurant'],
  spa: ['Spa treatments', 'Spa centre'],
};

export default function Filters({
  className,
  currency,
  hotels,
  onChange,
}: FiltersProps): JSX.Element {
  const minPrice = useMemo(
    () => Math.floor(getCheapestHotelPrice(hotels)[1]),
    [hotels],
  );
  const maxPrice = useMemo(
    () => Math.floor(getMostExpensiveHotelPrice(hotels)[1]),
    [hotels],
  );

  const [price, setPrice] = useState(maxPrice);
  const [stars, setStars] = useState({ 3: true, 4: true, 5: true });
  const [amenities, setAmenities] = useState({
    airConditioning: false,
    freeInternet: false,
    pool: false,
    freeBreakfast: false,
    kidFriendly: false,
    petFriendly: false,
    bar: false,
    restaurant: false,
    spa: false,
  });

  useEffect(
    () => {
      const now = new Date();
      const fc = new Promise((resolve) => {
        setTimeout(
          () => {
            if (fc !== finalCall && now.valueOf() - throttle.valueOf() < 100) {
              resolve();
              return;
            }

            throttle = now;

            onChange(
              (hotel: HotelModel): boolean => {
                if (Math.floor(getCheapestHotelPrice([hotel])[1]) > price) {
                  return false;
                }

                if (!(stars as { [key: number]: boolean })[hotel.rating]) {
                  return false;
                }

                const selectedAmenities = Object.keys(amenities).filter(
                  (amenity) => (amenities as { [key: string]: boolean })[amenity] === true,
                );

                let amenitiesOk = true;

                selectedAmenities.forEach((amenity) => {
                  const labels = hotelAmenityLabels[amenity];

                  const asd = hotel.amenities.find(
                    (hotelAmenity) => labels.indexOf(hotelAmenity.description) !== -1,
                  );

                  if (!asd || asd.value === 'false') {
                    amenitiesOk = false;
                  }
                });

                return amenitiesOk;
              },
            );

            resolve();
          },
          100,
        );
      });

      finalCall = fc;
    },
    [price, stars, amenities, onChange],
  );

  return (
    <Menu header="Filters" className={[css.Filters, className].join(' ')}>
      <div className={css.FilterMenuContent}>
        <div className={css.Price}>
          <label className={css.Label}>
            {`Price • ${price === maxPrice
              ? 'Any'
              : `${currency} ${Utils.formatCurrency(price)}`
            }`}
          </label>

          <RangeSlider
            className={css.PriceSlider}
            value={price}
            valueFormatter={(value): string => `${currency} ${Utils.formatCurrency(value)}`}
            min={minPrice}
            max={maxPrice}
            onChange={setPrice}
          />
        </div>

        <div className={css.HotelClass}>
          <label className={css.Label}>Hotel class</label>

          <div className={css.HotelClasses}>
            <Checkbox
              checked={stars[3]}
              onChange={(checked): void => setStars({ 3: checked, 4: stars[4], 5: stars[5] })}
            >
              3-star
            </Checkbox>
            <Checkbox
              checked={stars[4]}
              onChange={(checked): void => setStars({ 3: stars[3], 4: checked, 5: stars[5] })}
            >
              4-star
            </Checkbox>
            <Checkbox
              checked={stars[5]}
              onChange={(checked): void => setStars({ 3: stars[3], 4: stars[4], 5: checked })}
            >
              5-star
            </Checkbox>
          </div>
        </div>

        <div className={css.Amenities}>
          <label className={css.Label}>Amenities</label>

          <div className={css.AmenityOptions}>
            {Object.keys(amenities).map((amenity, idx) => (
              <Checkbox
                key={`amenity-${idx}`}
                checked={(amenities as { [key: string]: boolean })[amenity]}
                onChange={(checked): void => {
                  (amenities as { [key: string]: boolean })[amenity] = checked;

                  setAmenities({ ...amenities });
                }}
              >
                {amenityLabels[amenity]}
              </Checkbox>
            ))}
          </div>
        </div>
      </div>
    </Menu>
  );
}
