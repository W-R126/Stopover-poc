import BaseService from './BaseService';
import { GuestsModel } from '../Models/GuestsModel';
import SessionManager from '../SessionManager';
import { ExperienceResponse, Experience } from './Responses/ExperienceResponse';
import { ExperienceModel, ExperienceAvailabilityModel } from '../Models/ExperienceModel';

export default class ExperienceService extends BaseService {
  async getExperiences(
    passengers: GuestsModel,
    start: Date,
    end: Date,
    customerSegmentCode: string,
  ): Promise<ExperienceModel[] | undefined> {
    try {
      const requestData: {
        children?: number;
        infants?: number;
        fromDate: string;
        toDate: string;
        sabreClustM1: string;
      } = {
        fromDate: start.toLocaleDateString('sv-SE'),
        toDate: end.toLocaleDateString('sv-SE'),
        sabreClustM1: customerSegmentCode,
      };

      if (passengers.children > 0) {
        requestData.children = passengers.children;
      }

      if (passengers.infants > 0) {
        requestData.infants = passengers.infants;
      }

      const { data, status, headers } = await this.http.post<ExperienceResponse>(
        '/experiences',
        requestData,
        {
          headers: SessionManager.getSessionHeaders(),
        },
      );

      if (status === 200) {
        SessionManager.setSessionHeaders(headers);

        return this.parseExperiences(data.experiences);
      }
    } catch (err) {
      return undefined;
    }

    return undefined;
  }

  private parseExperiences(experiences: Experience[]): ExperienceModel[] {
    return experiences.map((experience): ExperienceModel => {
      const { product, availabilities } = experience;

      const availability = availabilities.items.map((item): ExperienceAvailabilityModel => {
        return {
          start: new Date(item.availabilityFromDateTime),
          end: new Date(item.availabilityFromDateTime),
          duration: item.availabilityDuration / 60,
        };
      });

      return {
        availability,
        title: product.productContent.productTitle,
        supplier: product.productContent.productSupplierName,
        id: product.productId,
        description: {
          long: product.productContent.productLongDescription,
          short: product.productContent.productShortDescription,
        },
        included: product.productContent.productIncludes.map(
          (include) => include.includeDescription,
        ),
        categories: product.productCategories.map((num) => Number.parseInt(num, 10)),
        pricing: product.productTypeSeasons[0].productTypeSeasonDetails.map((pts) => ({
          type: pts.productType,
          ageFrom: pts.productTypeAgeFrom,
          ageTo: pts.productTypeAgeTo,
          id: pts.productTypeId,
          label: pts.productTypeLabel,
          price: {
            total: Number.parseFloat(pts.productTypePricing.productTypeSalesPrice),
            tax: 0,
            currency: product.productPaymentDetail.productPaymentCurrency.currencyCode,
          },
        })),
        startingFromPrice: {
          total: Number.parseFloat(product.productFromPrice),
          tax: 0,
          currency: product.productPaymentDetail.productPaymentCurrency.currencyCode,
        },
        duration: product.productDuration,
        info: {
          additional: product.productContent.productAdditionalInformation,
          note: product.productContent.productEntryNotes,
          highlights: product.productContent.productHighlights.map(
            (highlight) => highlight.highlightDescription,
          ),
        },
        image: {
          url: product.productContent.productImages.find(
            (image) => image.imageType === 'BANNER',
          )?.imageUrl,
          thumbURL: product.productContent.productImages.find(
            (image) => image.imageType === 'MAIN',
          )?.imageUrl,
        },
        locations: product.productLocations.map((location) => ({
          name: location.locationName,
          city: location.locationAddress.city,
          type: location.locationType,
          description: location.locationDescription,
          coordinates: {
            long: Number.parseFloat(location.locationAddress.longitude),
            lat: Number.parseFloat(location.locationAddress.latitude),
          },
          country: location.locationAddress.country,
        })),
      };
    }).filter((experience) => experience.availability.length > 0);
  }
}
