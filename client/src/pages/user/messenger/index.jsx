import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import useSound from 'use-sound';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import Header from '../../../components/user/Header';
import FriendMess from '../../../components/user/Messenger/FriendMess';
import RightSide from '../../../components/user/Messenger/RightSide';
import friendsSlice from '../../../redux/slices/friendsSlice';
import messengerSlice from '../../../redux/slices/messengerSlice';
import dataURLtoBlob from '../../../helpers/dataURLtoBlob';
import uploadImages from '../../../functions/uploadImages';
import notificationSound from '../../../audio/notification.mp3';
import * as messengerApis from '../../../functions/messenger';
import { getFriend } from '../../../functions/friend';

function Messenger() {
  const {
    user,
    friends: friendStore,
    messenger: { messageSendSuccess, message, message_get_success },
  } = useSelector((state) => ({ ...state }));
  const friends = friendStore.data.friendMessenger;

  const dispatch = useDispatch();
  const { username } = useParams();
  const userName = username === undefined ? user.username : username;

  const actionsFriend = friendsSlice.actions;
  const actionsMessenger = messengerSlice.actions;
  const token = user.token;
  const [notificationSPlay] = useSound(notificationSound);

  const [typingMessage, setTypingMessage] = React.useState('');
  const [newMessage, setNewMessage] = React.useState('');
  const [displayMessageToFriend, setDisplayMessageToFriend] = React.useState();
  const [currentFriend, setCurrentFriend] = React.useState();
  const [imageMessage, setImageMessage] = React.useState();
  const [onlineFriends, setOnlineFriends] = React.useState([]);

  const scrollRef = React.useRef(null);
  const socketRef = React.useRef(null);

  const handleChangeInput = (e) => {
    setNewMessage(e.target.value);

    socketRef.current.emit('typingMessage', {
      senderId: user.id,
      receiverId: currentFriend._id,
      msg: e.target.value,
    });
  };

  const handleSendingMessage = async () => {
    if (!imageMessage) {
      const dataMessage = {
        senderName: userName,
        receiverId: currentFriend._id,
        message: newMessage ? newMessage : '❤️',
      };

      socketRef.current.emit('typingMessage', {
        senderId: user.id,
        receiverId: currentFriend._id,
        msg: '',
      });

      await messengerApis.messageSend(dataMessage, token, dispatch);
      setNewMessage('');
    } else {
      const img = dataURLtoBlob(imageMessage);
      const path = `${user.username}/message_images`;

      let formData = new FormData();
      formData.append('path', path);
      formData.append('file', img);

      const imgMes = await uploadImages(formData, token);
      await messengerApis.imageMessageSend(
        userName,
        currentFriend._id,
        imgMes.images[0].url,
        token,
        dispatch
      );
      setImageMessage('');
    }
  };

  const handleSendingMessageByPressingEnter = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      const dataMessage = {
        senderName: userName,
        receiverId: currentFriend._id,
        message: newMessage ? newMessage : '❤️',
      };
      socketRef.current.emit('typingMessage', {
        senderId: user.id,
        receiverId: currentFriend._id,
        msg: '',
      });
      await messengerApis.messageSend(dataMessage, token, dispatch);
      setNewMessage('');
    }
  };

  // get friend
  React.useEffect(() => {
    const getAllFriend = async () => {
      dispatch(actionsFriend.FRIEND_REQUEST());
      const res = await getFriend(token);
      if (res.success === true) {
        dispatch(actionsFriend.FRIEND_SUCCESS(res.data));
      } else {
        dispatch(actionsFriend.FRIEND_ERROR(res.data));
      }
    };
    getAllFriend();
  }, []);

  // set current friend
  React.useEffect(() => {
    if (friends && friends.length > 0 && !currentFriend) {
      setCurrentFriend(friends[0].friendInfo);
    }
  }, [friends]);

  // get all message
  React.useEffect(() => {
    messengerApis.getAllMessage(currentFriend?._id, token, dispatch);

    // friend seen tin nhan khi click vao sidebar
    if (friends?.length > 0) {
      dispatch(
        actionsFriend.UPDATE_SEEN_MESSAGE({
          id: currentFriend._id,
        })
      );
    }
  }, [currentFriend?._id]);

  React.useEffect(() => {
    if (message.length > 0) {
      if (
        message[message.length - 1].senderId !== user.id &&
        message[message.length - 1].status !== 'seen'
      ) {
        // UPDATE = UPDATE_SEEN_MESSAGE
        // dispatch(
        //   actionsFriend.UPDATE({
        //     id: currentFriend._id,
        //   })
        // );
        socketRef.current.emit('seen', {
          senderId: currentFriend._id,
          receiverId: user.id,
        });
        messengerApis.seenMessage(
          { _id: message[message.length - 1]._id },
          token
        );
      }
    }
    dispatch(actionsMessenger.MESSAGE_GET_SUCCESS_CLEAR());
  }, [message_get_success]);

  // scroll to end page
  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({
      block: 'end',
      inline: 'nearest',
    });
  }, [message]);

  React.useEffect(() => {
    socketRef.current = io('ws://localhost:8000');
    // start: nguoi nhan lang nghe su kien
    socketRef.current.on('currentFriendReceiveTypingMessage', (data) => {
      setTypingMessage(data);
    });

    socketRef.current.on('currentFriendReceiveMessage', (data) => {
      setDisplayMessageToFriend(data);
    });
    // end: nguoi nhan lang nghe su kien

    // start: nguoi gui lang nghe su kien
    // cap nhat status tin nhan
    socketRef.current.on('messageSeenResponse', (messageInfo) => {
      dispatch(
        actionsFriend.SEEN_MESSAGE({
          ...messageInfo,
        })
      );
    });
    // cap nhat status tin nhan
    socketRef.current.on('messageSentResponse', (messageInfo) => {
      dispatch(
        actionsFriend.SENT_MESSAGE({
          ...messageInfo,
        })
      );
    });
    // end: nguoi gui lang nghe su kien
    socketRef.current.on('seenSuccess', (data) => {
      dispatch(actionsFriend.SEEN_ALL(data));
    });
  }, []);

  // add user to socket
  React.useEffect(() => {
    socketRef.current.emit('addUser', user.id, user);
  }, []);

  // get user from socket
  React.useEffect(() => {
    socketRef.current.on('getUser', (socketUsers) => {
      const filterFriends = socketUsers.filter(
        (socketUser) => socketUser.userId !== user.id
      );
      setOnlineFriends(filterFriends);
    });
  }, []);

  React.useEffect(() => {
    if (messageSendSuccess) {
      // gui tin nhan den nguoi nhan
      setTimeout(() => {
        socketRef.current.emit('sendMessage', message[message.length - 1]);
      }, 500);
      // Hien thi tin nhan moi nhat ben phia nguoi gui phan sidebar ben trai
      dispatch(
        actionsFriend.UPDATE_LAST_MESSAGE({
          ...message[message.length - 1],
        })
      );
      // gan messageSendSuccess = false
      dispatch(actionsMessenger.MESSAGE_SEND_SUCCESS_CLEAR());
    }
  }, [messageSendSuccess]);

  React.useEffect(() => {
    // displayMessageToFriend = socketMessage
    if (displayMessageToFriend && currentFriend) {
      if (
        displayMessageToFriend.senderId === currentFriend._id &&
        displayMessageToFriend.receiverId === user.id
      ) {
        // SOCKET_MESSAGE = DISPLAY_MESSAGE_TO_FRIEND
        // luu vao store nguoi nhan de hien tin nhan ben nguoi nhan
        dispatch(
          actionsMessenger.DISPLAY_MESSAGE_TO_FRIEND(displayMessageToFriend)
        );

        // cap nhat status = seen vao csdl ko tr ve gi het
        messengerApis.seenMessage(displayMessageToFriend, token);
        // hien thi tin nhan moi nhat va status tin nhan ben phia sidebar nguoi nhan
        dispatch(
          actionsFriend.UPDATE_LAST_MESSAGE({
            ...displayMessageToFriend,
            status: 'seen',
          })
        );
        // nguoi nhan phat su kien
        socketRef.current.emit('messageSeen', displayMessageToFriend);
      }
    }
    setDisplayMessageToFriend('');
  }, [displayMessageToFriend]);

  React.useEffect(() => {
    // displayMessageToFriend = socketMessage
    if (
      displayMessageToFriend &&
      displayMessageToFriend.senderId !== currentFriend._id &&
      displayMessageToFriend.receiverId === user.id
    ) {
      // displayMessageToFriend = socketMessage
      notificationSPlay();
      toast.success(
        `${displayMessageToFriend.senderName} đã gửi một tin nhắn`,
        {
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '18px',
          },
        }
      );
      // cap nhat status = sent vao csdl ko tr ve gi het
      messengerApis.sentMessage(displayMessageToFriend, token);
      // hien thi tin nhan moi nhat va trang thai tin nhan ben phia sidebar nguoi nhan
      dispatch(
        actionsFriend.UPDATE_LAST_MESSAGE({
          ...displayMessageToFriend,
          status: 'sent',
        })
      );
      // nguoi nhan phat su kien
      socketRef.current.emit('sentMessage', displayMessageToFriend);
    }
  }, [displayMessageToFriend]);

  return (
    <>
      <Header />
      <Toaster position={'top-center'} reverseOrder={false} />
      <div className={'messenger'}>
        <div className="row-custom">
          <div className="col-3">
            <div className="left-side">
              <div className="top">
                <div className="image-name">
                  <div className="image">
                    <img src={user.picture} alt="" />
                  </div>
                  <div className="name">
                    <h3>Nhắn tin</h3>
                  </div>
                </div>

                <div className="icons">
                  <div className="icon">
                    <MoreHorizIcon />
                  </div>

                  {/* {visible && (
                    <div className="theme_logout">
                      <h3>Dark Mode</h3>
                      <div className="on">
                        <label htmlFor="dark">ON</label>
                        <input
                          onChange={(e) => themeSet(e.target.value)}
                          value="dark"
                          type="radio"
                          name="theme"
                          id="dark"
                        />
                      </div>
  
                      <div className="of">
                        <label htmlFor="white">OFF</label>
                        <input
                          onChange={(e) => themeSet(e.target.value)}
                          value="white"
                          type="radio"
                          name="theme"
                          id="white"
                        />
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
              <div className="friend-search">
                <div className="search">
                  <SearchIcon color="success" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm trong tin nhắn"
                    className="form-control-cus"
                  />
                </div>
              </div>

              <div className="friends-mess">
                {friends && friends.length
                  ? friends.map((friend) => (
                      <div
                        className={`hover-friend ${
                          currentFriend?._id === friend.friendInfo._id
                            ? 'active1'
                            : 'hover1'
                        }`}
                        onClick={() => setCurrentFriend(friend.friendInfo)}
                        key={friend.friendInfo._id}
                      >
                        <FriendMess
                          friend={friend}
                          userId={user.id}
                          onlineFriends={onlineFriends}
                        />
                      </div>
                    ))
                  : 'No friends'}
              </div>
            </div>
          </div>

          {currentFriend && (
            <RightSide
              handleSendingMessageByPressingEnter={
                handleSendingMessageByPressingEnter
              }
              handleChangeInput={handleChangeInput}
              handleSendingMessage={handleSendingMessage}
              setImageMessage={setImageMessage}
              setNewMessage={setNewMessage}
              typingMessage={typingMessage}
              currentFriend={currentFriend}
              imageMessage={imageMessage}
              newMessage={newMessage}
              onlineFriends={onlineFriends}
              scrollRef={scrollRef}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Messenger;
