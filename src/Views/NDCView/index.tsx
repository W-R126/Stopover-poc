import React from 'react';
import commonCss from '../../common.module.css';
import css from './NDCView.module.css';
import NDCHeaderImg from '../../Assets/Images/NDC/ndc-back.jpg';

import TripSearch from './Components/TripSearch';
import PackagePrompt from './Components/PackagePrompt';

import ContentService from './Services/ContentService';
import AirportService from '../../Services/AirportService';
import { TripModel, copyTrip } from './Models/TripModel';
import NDCService from './Services/NDCService';
import { AirportModel } from '../../Models/AirportModel';
import {
  Ns1Hotel,
  PaxList,
  PaxSegment,
  Ns1Experience,
  DataLists,
  PaxJourney,
  FlightItemModel,
  TotalOfferPrice,
  PassengerModel,
} from './Models/NDCModel';
import { LegModel } from '../../Models/LegModel';

interface NDCViewState {
  trip: TripModel;
  packageStatus: number; // 0: loading, 200: result success, 204, 500: error
  showPackage: boolean;
  outbound?: FlightItemModel;
  inbound?: FlightItemModel;
  hotel?: Ns1Hotel;
  experience?: Ns1Experience;
  paxList?: PassengerModel;
  airports?: AirportModel[];
  totalPrice?: TotalOfferPrice;
}

interface NDCViewProps {
  airportService: AirportService;
  contentService: ContentService;
  ndcService: NDCService;
}

class NDCView extends React.Component<NDCViewProps, NDCViewState> {
  constructor(props: any) {
    super(props);

    this.state = {
      trip: copyTrip(),
      packageStatus: 0,
      showPackage: false,
      outbound: undefined,
      inbound: undefined,
      hotel: undefined,
      experience: undefined,
      paxList: undefined,
      totalPrice: undefined,
    };

    this.onTripSearchChange = this.onTripSearchChange.bind(this);
    this.onTripSearch = this.onTripSearch.bind(this);
  }

  private onTripSearchChange(trip: TripModel): void {
    this.setState({ trip });
  }

  private async onTripSearch(trip: TripModel): Promise<void> {
    const { ndcService, airportService } = this.props;

    this.setState({
      showPackage: true,
      packageStatus: 0,
    });

    const ndcReq = ndcService.getFlights(
      trip.passengers,
      trip.legs.map((leg: LegModel) => ({
        originCode: leg.origin?.code ?? '',
        destinationCode: leg.destination?.code ?? '',
        departure: leg.departure as Date,
      })),
      trip.cabinClass,
    );

    const ndcResponse = ndcReq;
    ndcResponse.then(async (responseData): Promise<void> => {
      if (responseData.status === 200 && responseData.responseNDC && responseData.offerTotalPrice) {
        const airportsReq = airportService.getAirports();
        const airports = await airportsReq;
        const response = responseData.responseNDC.Response;
        const outbound = this.getDepatureOnwards(response.DataLists, 0);
        const inbound = this.getDepatureOnwards(response.DataLists, 1);
        const paxList = response.DataLists.PaxList
          ? this.formatPaxList(response.DataLists.PaxList)
          : undefined;
        const AugmentationPoint = responseData.responseNDC.AugmentationPoint ?? undefined;
        const totalPrice = responseData.offerTotalPrice;

        let experience;
        let hotel;
        if (AugmentationPoint) {
          if (AugmentationPoint['ns1:ExperienceList'] && AugmentationPoint['ns1:ExperienceList']['ns1:Experience']) {
            experience = AugmentationPoint['ns1:ExperienceList']['ns1:Experience'] ?? undefined;
          }
          if (AugmentationPoint['ns1:HotelList']) {
            hotel = AugmentationPoint['ns1:HotelList']['ns1:Hotel'] ?? undefined;
          }
        }

        this.setState({
          packageStatus: 200,
          outbound,
          inbound,
          hotel,
          experience,
          paxList,
          airports,
          totalPrice,
        });
      } else {
        this.setState({
          packageStatus: responseData.status,
          outbound: undefined,
          inbound: undefined,
          hotel: undefined,
          experience: undefined,
          paxList: undefined,
          airports: undefined,
          totalPrice: undefined,
        });
      }
    });
  }

  private getDepatureOnwards(
    dataList: DataLists, nBoundKind: number,
  ): FlightItemModel | undefined {
    const { PaxJourneyList, PaxSegmentList } = dataList;
    const segementList: PaxSegment[] = [];
    let selectedPaxJourney: PaxJourney|undefined;
    let paxJourneyTemp: PaxJourney;

    if (Array.isArray(PaxJourneyList.PaxJourney)) {
      paxJourneyTemp = PaxJourneyList.PaxJourney[0] ?? undefined;
    } else if (PaxJourneyList.PaxJourney) {
      paxJourneyTemp = PaxJourneyList.PaxJourney;
    } else {
      return undefined;
    }

    if (Array.isArray(paxJourneyTemp.PaxSegmentRefID)) {
      selectedPaxJourney = {
        ...paxJourneyTemp,
        PaxSegmentRefID: paxJourneyTemp.PaxSegmentRefID[nBoundKind],
      };
    } else if (nBoundKind === 0) {
      selectedPaxJourney = {
        ...paxJourneyTemp,
      };
    } else if (nBoundKind === 1) return undefined;

    if (!selectedPaxJourney) return undefined;

    if (Array.isArray(PaxSegmentList.PaxSegment)) {
      PaxSegmentList.PaxSegment.forEach((itemOne: PaxSegment) => {
        if (!selectedPaxJourney || !selectedPaxJourney.PaxSegmentRefID) { return; }
        if (Array.isArray(selectedPaxJourney.PaxSegmentRefID)) {
          const filteredOne = selectedPaxJourney.PaxSegmentRefID.filter(
            (itemFilter: string) => itemFilter === itemOne.PaxSegmentID,
          );
          if (filteredOne.length > 0) { segementList.push(itemOne); }
        } else if (selectedPaxJourney.PaxSegmentRefID === itemOne.PaxSegmentID) {
          segementList.push(itemOne);
        }
      });
    } else {
      segementList.push(PaxSegmentList.PaxSegment);
    }

    return {
      paxJourney: selectedPaxJourney,
      paxSegment: segementList,
    };
  }

  private formatPaxList = (paxList: PaxList): PassengerModel => {
    if (Array.isArray(paxList.Pax)) {
      return paxList as PassengerModel;
    }
    return {
      Pax: [{
        ...paxList.Pax,
      }],
    } as PassengerModel;
  }

  render(): JSX.Element {
    const {
      trip,
      showPackage,
      packageStatus,
      outbound,
      inbound,
      hotel,
      experience,
      paxList,
      airports,
      totalPrice,
    } = this.state;

    const { contentService, airportService } = this.props;

    return (
      <div className={css.NDCView}>
        <div className={css.Navbar}>
          <div className={commonCss.ContentWrapper}>
            Vacations.com
          </div>
        </div>
        <div className={css.Header}>
          <img className={css.BackImg} src={NDCHeaderImg} alt="NDC header" />
          <div className={`${commonCss.ContentWrapper} ${css.TripSearchWrapper}`}>
            <TripSearch
              airportService={airportService}
              contentService={contentService}
              className={css.TripSearch}
              trip={trip}
              onSearch={this.onTripSearch}
              onChange={this.onTripSearchChange}
            />
          </div>
        </div>
        {showPackage && (
          <PackagePrompt
            viewStatus={packageStatus}
            closePrompt={(): void => {
              this.setState({
                showPackage: false,
              });
            }}
            trip={trip}
            outbound={outbound}
            inbound={inbound}
            hotel={hotel}
            experience={experience}
            paxList={paxList}
            contentService={contentService}
            airports={airports}
            totalPrice={totalPrice}
          />
        )}
      </div>
    );
  }
}

export default NDCView;
