import React, { useMemo } from 'react';

import css from './HotelInfoModal.module.css';
import { HotelModel, getCheapestHotelPrice } from '../../../../../../../Models/HotelOfferModel';
import InfoModal from '../../../../../InfoModal';
import Page from '../../../../../InfoModal/Page';
import GoogleMaps from '../../../../../../../Components/GoogleMaps';
import Utils from '../../../../../../../Utils';

interface HotelInfoModalProps {
  hotel: HotelModel;
  onClose: () => void;
}

export default function HotelInfoModal({
  hotel,
  onClose,
}: HotelInfoModalProps): JSX.Element {
  const amenities = useMemo(
    () => hotel.amenities.filter(
      (amenity) => amenity.value !== undefined
        && amenity.value !== 'false'
        && amenity.value !== '0',
    ),
    [hotel],
  );

  const startPrice = useMemo(
    () => getCheapestHotelPrice([hotel]),
    [hotel],
  )[1];

  const images = useMemo(
    () => hotel.images.map((image) => ({ url: image.original, alt: image.description })),
    [hotel],
  );

  return (
    <InfoModal
      onClose={onClose}
      title={hotel.name}
      images={images}
    >
      <Page title="Summary" className={css.Summary}>
        <div className={css.Header}>
          <div className={css.Pricing}>
            <span>Pricing</span>

            <div>
              <strong>
                {`From ${hotel.rooms[0].offers[0].price.currency} ${
                  Utils.formatCurrency(startPrice)}`}
              </strong>
            </div>
          </div>

          <div className={css.CheckIn}>
            <span>Check-in</span>

            <div>{hotel.checkIn}</div>
          </div>
        </div>

        <div className={css.Content}>
          Hotel description not available.
        </div>
      </Page>

      <Page title="Location" className={css.Location}>
        <GoogleMaps coordinates={hotel.coordinates} />
      </Page>

      <Page title="Amenities" className={css.Amenities}>
        {amenities.map((amenity, idx) => (
          <span key={`amenity-${idx}`}>{`· ${amenity.description}`}</span>
        ))}
      </Page>
    </InfoModal>
  );
}
