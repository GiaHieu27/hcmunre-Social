import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import Header from '../../../components/user/Header';
import Card from './Card';
import friendsSlice from '../../../redux/slices/friendsSlice';
import { getFriend } from '../../../apis/friend';

function Friend() {
  const dispatch = useDispatch();
  const { type } = useParams();

  const { user: userStore, friends: friendData } = useSelector((state) => ({
    ...state,
  }));
  const friends = friendData.data;
  const allFriends = friendData.data.friends;
  const actions = friendsSlice.actions;

  const [sentRequest, setSentRequest] = React.useState();
  const [suggestFriends, setSuggestFriends] = React.useState();

  const getFriendPages = React.useCallback(async () => {
    dispatch(actions.FRIEND_REQUEST());
    const res = await getFriend(userStore.token);
    if (res.success === true) {
      dispatch(actions.FRIEND_SUCCESS(res.data));
    } else {
      dispatch(actions.FRIEND_ERROR(res.data));
    }
  }, [dispatch, actions, userStore.token]);

  React.useEffect(() => {
    getFriendPages();
  }, [getFriendPages]);

  React.useEffect(() => {
    setSentRequest(friends.sentRequests);
    setSuggestFriends(friends.suggestFriends);
  }, [friends]);

  return (
    <>
      <Header page="friends" />
      <div className="friends">
        <div className="friends_left">
          <div className="friends_left_header">
            <h3>Bạn bè</h3>
            <div className="small_circle me-1">
              <i className="settings_filled_icon"></i>
            </div>
          </div>

          <div className="friends_left_wrap">
            <Link
              to="/friends"
              className={`mmenu_item hover3 ${
                type === undefined && 'mmenu_item active_friends'
              }`}
            >
              <div className="small_circle">
                <i className="friends_home_icon"></i>
              </div>
              <span>Trang chủ</span>
            </Link>

            <Link
              to="/friends/requests"
              className={`mmenu_item hover3 ${
                type === 'requests' && 'mmenu_item active_friends'
              }`}
            >
              <div className="small_circle">
                <i className="friends_requests_icon"></i>
              </div>
              <span>Yêu cầu kết bạn</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>

            <Link
              to="/friends/sent"
              className={`mmenu_item hover3 ${
                type === 'sent' && 'mmenu_item active_friends'
              }`}
            >
              <div className="small_circle">
                <i className="friends_requests_icon"></i>
              </div>
              <span>Lời mời kết bạn</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>

            <Link
              to="/friends/suggest"
              className={`mmenu_item hover3 ${
                type === 'suggest' && 'mmenu_item active_friends'
              }`}
            >
              <div className="small_circle">
                <i className="friends_requests_icon"></i>
              </div>
              <span>Gợi ý kết bạn</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>

            <Link
              to="/friends/all"
              className={`mmenu_item hover3 ${
                type === 'all' && 'mmenu_item active_friends'
              }`}
            >
              <div className="small_circle">
                <i className="all_friends_icon"></i>
              </div>
              <span>Tất cả bạn bè</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
          </div>
        </div>

        <div className="friends_right">
          {(type === undefined || type === 'requests') && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Yêu cầu kết bạn</h3>
                {type === undefined && (
                  <Link to="/friends/requests" className="see_link hover3">
                    Xem tất cả
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {friends.requests &&
                  friends.requests.map((friend) => (
                    <Card
                      key={friend._id}
                      friend={friend}
                      userStore={userStore}
                      getFriendPages={getFriendPages}
                      type="request"
                    />
                  ))}
              </div>
            </div>
          )}

          {(type === undefined || type === 'sent') && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Lời mời kết bạn</h3>
                {type === undefined && (
                  <Link to="/friends/sent" className="see_link hover3">
                    Xem tất cả
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {sentRequest &&
                  sentRequest.map((friend) => (
                    <Card
                      key={friend._id}
                      friend={friend}
                      userStore={userStore}
                      getFriendPages={getFriendPages}
                      type="sent"
                    />
                  ))}
              </div>
            </div>
          )}

          {(type === undefined || type === 'suggest') && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Gợi ý kết bạn</h3>
                {type === undefined && (
                  <Link to="/friends/suggest" className="see_link hover3">
                    Xem tất cả
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {suggestFriends &&
                  suggestFriends.map((friend) => (
                    <Card
                      key={friend._id}
                      friend={friend}
                      userStore={userStore}
                      getFriendPages={getFriendPages}
                      setSuggestFriends={setSuggestFriends}
                      setSentRequest={setSentRequest}
                      sentRequest={sentRequest}
                      suggestFriends={suggestFriends}
                      type="suggest"
                    />
                  ))}
              </div>
            </div>
          )}

          {(type === undefined || type === 'all') && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Tất cả bạn bè</h3>
                {type === undefined && (
                  <Link to="/friends/all" className="see_link hover3">
                    Xem tất cả
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {allFriends &&
                  allFriends.map((friend) => (
                    <Card
                      key={friend._id}
                      friend={friend}
                      userStore={userStore}
                      getFriendPages={getFriendPages}
                      type="friend"
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Friend;
