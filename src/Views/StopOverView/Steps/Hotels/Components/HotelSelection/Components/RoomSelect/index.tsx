import React from 'react';
import css from './RoomSelect.module.css';
import { HotelRateInfo } from '../../../../../../../../Services/Responses/ConfirmStopOverResponse';

interface RoomSelectProps {
  hotelRateInfo: HotelRateInfo;
  showDetailModal: Function;
}

interface RoomSelectState {
  showRoomsCount: number;
}

export default class RoomSelect extends React.Component<RoomSelectProps, RoomSelectState> {
  constructor(props: RoomSelectProps) {
    super(props);
    this.state = {
      showRoomsCount: 3,
    };
    this.handleClickMoreRooms = this.handleClickMoreRooms.bind(this);
  }

  private handleClickMoreRooms(): void {
    const { hotelRateInfo } = this.props;
    const { showRoomsCount } = this.state;
    const rLength = hotelRateInfo.rooms.room.length;
    this.setState({
      showRoomsCount: showRoomsCount + 3 < rLength ? showRoomsCount + 3 : rLength,
    });
  }

  render(): JSX.Element {
    const { showRoomsCount } = this.state;
    const { hotelRateInfo, showDetailModal } = this.props;
    return (
      <>
        <div className={css.RoomContainer}>
          <div className={css.SelectRoomDiv}>
            <h3>Select your room</h3>
            <div
              className={css.HideDetailBtn}
              onClick={(): void => { showDetailModal(); }}
              role="button"
            >
              Hotel details
            </div>
          </div>
          <div className={css.CheckInDiv}>
            Check-in 03 June Check-out 05 June (2 nights), 1 Audit
          </div>
          {
          hotelRateInfo.rooms.room.map((item, nIndex) => {
            if (nIndex < showRoomsCount) {
              return (
                <div className={css.RoomContent} key={nIndex}>
                  <div className={css.RoomInfo}>
                    <b>{item?.roomDescription?.name}</b>
                    <p>1 king bed or 2 twin beds</p>
                  </div>
                  <button className={css.AddRoomBtn} type="button">+ AED 0</button>
                </div>
              );
            } return null;
          })
        }
        </div>
        {showRoomsCount <= hotelRateInfo.rooms.room.length && (
          <div className={css.MoreRooms}>
            <button className={css.MoreRoomBtn} onClick={this.handleClickMoreRooms} type="button">
              <span className={css.AngleDown} />
              {`${hotelRateInfo.rooms.room.length - showRoomsCount > 3 ? 3 : hotelRateInfo.rooms.room.length - showRoomsCount} more rooms`}
            </button>
          </div>
        )}
      </>
    );
  }
}
