import axios from 'axios';
import BaseService from '../../../Services/BaseService';
import ContentService from './ContentService';
import AirportService from '../../../Services/AirportService';
import { CabinClassEnum } from '../Enums/CabinClassEnum';
import { GuestsModel } from '../../../Models/GuestsModel';
import { IataAirShoppingRs, TotalOfferPrice } from '../Models/NDCModel';
import { RemoveJsonTextAttribute } from '../Utils';

import Config from '../../../Config';

const convert = require('xml-js');

export default class NDCService extends BaseService {
  private readonly contentService: ContentService;

  private readonly airportService: AirportService;

  constructor(
    contentService: ContentService,
    airportService: AirportService,
    config: Config,
  ) {
    super(config);

    this.contentService = contentService;
    this.airportService = airportService;
  }

  async getFlights(
    passengers: GuestsModel,
    legs: {
      originCode: string;
      destinationCode: string;
      departure: Date;
    }[],
    cabinClass?: CabinClassEnum,
  ): Promise<{
    responseNDC: IataAirShoppingRs;
    offerTotalPrice: TotalOfferPrice;
  }|undefined> {
    let resp;
    try {
      const config = new Config();
      const { status, data } = await axios({
        url: `${config.ndcApiBaseURL}/flights`,
        method: 'POST',
        data: this.formatRequestXML(passengers, legs, cabinClass),
        headers: {
          'Content-Type': 'text/xml',
          Authorization: `Bearer ${config.ndcAuthToken}`,
        },
      });

      if (status === 200) {
        resp = data;
        const result = convert.xml2js(resp, {
          compact: true,
          trim: true,
          ignoreDeclaration: true,
          ignoreInstruction: true,
          ignoreAttributes: true,
          ignoreComment: true,
          ignoreCdata: true,
          ignoreDoctype: true,
          textFn: RemoveJsonTextAttribute,
        });

        if (result.IATA_AirShoppingRS) {
          return {
            responseNDC: result.IATA_AirShoppingRS,
            offerTotalPrice: this.getCurrencyCode(resp, result.IATA_AirShoppingRS),
          };
        }
        return undefined;
      }
    } catch (err) {
      return undefined;
    }

    return undefined;
  }

  private getCurrencyCode(
    xmlString: string, jsonResponse: IataAirShoppingRs,
  ): TotalOfferPrice {
    const hOfferStr = xmlString.substring(
      xmlString.indexOf('<HighestOfferPrice>'),
      xmlString.indexOf('</HighestOfferPrice>'),
    );

    const codePrefixStr = 'CurCode="';
    const hOffer = hOfferStr.substr(
      hOfferStr.indexOf(codePrefixStr) + codePrefixStr.length, 3,
    );
    const carrierOffersSummary = jsonResponse.Response.OffersGroup.CarrierOffers.CarrierOffersSummary;
    return {
      HighestOfferPrice: parseFloat(carrierOffersSummary.HighestOfferPrice.TotalAmount),
      LowestOfferPrice: parseFloat(carrierOffersSummary.LowestOfferPrice.TotalAmount),
      CurCode: hOffer,
    } as TotalOfferPrice;
  }

  private formatRequestXML(
    passengers: GuestsModel,
    legs: {
      originCode: string;
      destinationCode: string;
      departure: Date;
    }[],
    cabinClass?: CabinClassEnum,
  ): string {
    let xmlBodyStr = `<?xml version='1.0' encoding='utf8'?>
    <IATA_AirShoppingRQ xmlns="http://www.iata.org/IATA/2015/00/2020.1/IATA_AirShoppingRQ">
      <MessageDoc>
        <Name>Etihad NDC GATEWAY</Name>
        <RefVersionNumber>1.0</RefVersionNumber>
      </MessageDoc>
      <Party>
        <Sender>
          <TravelAgency>
            <AgencyID>00010080</AgencyID>
            <Name>Snowfall TECHNOLOGIES</Name>
            <TypeCode>OnlineTravelAgency</TypeCode>
          </TravelAgency>
        </Sender>
      </Party>
      <Request>
    `;

    // add Flight Request
    xmlBodyStr += '<FlightRequest>';
    legs.forEach((item) => {
      xmlBodyStr += `<OriginDestCriteria>
      <OriginDepCriteria>
          <Date>${item.departure.toLocaleDateString('sv-SE')}</Date>
          <IATA_LocationCode>${item.originCode}</IATA_LocationCode>
      </OriginDepCriteria>
      <DestArrivalCriteria>
          <IATA_LocationCode>${item.destinationCode}</IATA_LocationCode>
      </DestArrivalCriteria>
  </OriginDestCriteria>`;
    });
    xmlBodyStr += '</FlightRequest>';

    // add Paxs
    const reqPassengers = {
      ADT: passengers.adults,
      CHD: passengers.children,
      INF: passengers.infants,
    };
    xmlBodyStr += '<Paxs>';
    let nPaxID = 1;
    Object.keys(reqPassengers).forEach((key): void => {
      const passengerCount = (reqPassengers as { [key: string]: number })[key];
      if (passengerCount >= 1) {
        for (let i = 0; i < passengerCount; i += 1) {
          xmlBodyStr += `<Pax>
            <PaxID>Pax${nPaxID}</PaxID>
            <PTC>${key}</PTC>
          </Pax>
          `;
          nPaxID += 1;
        }
      }
    });
    xmlBodyStr += '</Paxs>';

    let cabinClassName = '';
    switch (cabinClass) {
      case CabinClassEnum.P:
        cabinClassName = 'First';
        break;
      case CabinClassEnum.F:
        cabinClassName = 'First';
        break;
      case CabinClassEnum.J:
        cabinClassName = 'Business';
        break;
      case CabinClassEnum.C:
        cabinClassName = 'Business';
        break;
      case CabinClassEnum.S:
        cabinClassName = 'Economy';
        break;
      case CabinClassEnum.Y:
        cabinClassName = 'Economy';
        break;
      default:
        cabinClassName = 'First';
        break;
    }
    // add shopping criteria
    xmlBodyStr += `<ShoppingCriteria>
      <CarrierCriteria>
        <Carrier>
          <AirlineDesigCode>EY</AirlineDesigCode>
        </Carrier>
      </CarrierCriteria>
      <FlightCriteria>
        <CabinType>
          <CabinTypeCode>${cabinClass}</CabinTypeCode>
          <CabinTypeName>${cabinClassName}</CabinTypeName>
        </CabinType>
      </FlightCriteria>
    </ShoppingCriteria>`;

    xmlBodyStr += `</Request>
    </IATA_AirShoppingRQ>`;
    return xmlBodyStr;
  }
}
