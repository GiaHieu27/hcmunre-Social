import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  acceptRequest,
  cancelRequest,
  deleteRequest,
  addFriend,
} from '../../../functions/friend';

function Card({
  friend,
  userStore,
  type,
  getFriendPages,
  setSuggestFriends,
  sentRequest,
  suggestFriends,
  setSentRequest,
}) {
  const token = userStore.token;

  const handleCancelRequest = async (friendId) => {
    const res = await cancelRequest(friendId, token);
    if (res === 'ok') getFriendPages();
  };
  const handleAcceptRequest = async (friendId) => {
    const res = await acceptRequest(friendId, token);
    if (res === 'ok') getFriendPages();
  };
  const handleDeleteRequest = async (friendId) => {
    const res = await deleteRequest(friendId, token);
    if (res === 'ok') getFriendPages();
  };

  const handleAddingFriend = async (friendId) => {
    const res = await addFriend(friendId, token);
    if (res === 'ok') {
      // const newSuggestFriends = suggestFriends.filter(
      //   (friend) => friend._id !== friendId
      // );
      // setSuggestFriends(newSuggestFriends);
      getFriendPages();
    }
  };

  return (
    <div className="req_card">
      <Link to={`/profile/${friend.username}`}>
        <img src={friend.picture} alt="" />
      </Link>
      <div className="req_name">
        {friend.first_name} {friend.last_name}
      </div>
      {type === 'sent' ? (
        <button
          className="green_btn"
          onClick={() => handleCancelRequest(friend._id)}
        >
          Huỷ yêu cầu
        </button>
      ) : type === 'request' ? (
        <>
          <button
            className="green_btn"
            onClick={() => handleAcceptRequest(friend._id)}
          >
            Xác nhận
          </button>
          <button
            className="gray_btn"
            onClick={() => handleDeleteRequest(friend._id)}
          >
            Xoá
          </button>
        </>
      ) : type === 'suggest' ? (
        <button
          className="green_btn"
          onClick={() => handleAddingFriend(friend._id)}
        >
          Kết bạn
        </button>
      ) : (
        ''
      )}
    </div>
  );
}

Card.propTypes = {
  type: PropTypes.string,

  friend: PropTypes.object,
  userStore: PropTypes.object,

  sentRequest: PropTypes.array,
  suggestFriends: PropTypes.array,

  getFriendPages: PropTypes.func,
  setSuggestFriends: PropTypes.func,
  setSentRequest: PropTypes.func,
};

export default Card;
