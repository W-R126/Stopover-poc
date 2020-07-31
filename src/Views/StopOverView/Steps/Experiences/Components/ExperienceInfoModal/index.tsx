import React from 'react';

import css from './ExperienceInfoModal.module.css';
import InfoModal from '../../../../InfoModal';
import { ExperienceModel } from '../../../../../../Models/ExperienceModel';
import Page from '../../../../InfoModal/Page';
import DateUtils from '../../../../../../DateUtils';
import GoogleMaps from '../../../../../../Components/GoogleMaps';
import Utils from '../../../../../../Utils';

interface ExperienceInfoModalProps {
  experience: ExperienceModel;
  onClose: () => void;
}

export default function ExperienceInfoModal({
  experience,
  onClose,
}: ExperienceInfoModalProps): JSX.Element {
  return (
    <InfoModal
      onClose={onClose}
      title={experience.title}
      images={experience.image.url ? [{ url: experience.image.url }] : undefined}
    >
      <Page title="Summary" className={css.Summary}>
        <div className={css.Header}>
          <div className={css.Pricing}>
            <span>Pricing</span>

            <div>
              {experience.pricing.filter((pricing) => pricing.price.total !== 0).map(({
                price,
                label,
                ageFrom,
                ageTo,
              }, idx) => (
                <div key={`pricing-${idx}`} className={css.PricingEntry}>
                  <strong>{`${price.currency} ${Utils.formatCurrency(price.total)}`}</strong>
                  <span>{`/${label} (${ageFrom} - ${ageTo}yrs)`}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={css.Duration}>
            <span>Duration</span>

            <div>{DateUtils.getDDHHMMFromMinutes(experience.duration)}</div>
          </div>

          <div className={css.Language}>
            <span>Language</span>

            <div>English</div>
          </div>
        </div>

        <div className={css.Content}>
          {experience.description.long === ''
            ? (<p>No information available</p>)
            : experience.description.long.split('\n').map((paragraph, idx) => (
              <p key={`paragraph-${idx}`}>
                {paragraph}
              </p>
            ))}
        </div>
      </Page>

      <Page title="Location" className={css.Location}>
        <GoogleMaps coordinates={experience.locations[0].coordinates} />
      </Page>

      <Page title="What's included" className={css.Included}>
        <div className={css.Content}>
          {experience.included.length === 0
            ? (<p>No information available</p>)
            : experience.included.map((item, idx) => (
              <p key={`included-${idx}`}>
                {`• ${item}`}
              </p>
            ))}
        </div>
      </Page>
    </InfoModal>
  );
}
