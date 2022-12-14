import { Link } from 'react-router-dom';

function LeftLink({ icon, text, notification }) {
  return (
    <>
      <Link
        to={
          text === 'Đã lưu'
            ? '/saved'
            : text === 'Bạn bè'
            ? '/friends'
            : text === 'Nhắn tin'
            ? '/messenger'
            : ''
        }
      >
        <div className="left_link hover2">
          {icon}
          {notification !== undefined ? (
            <div className="col">
              <div className="col_1">{text}</div>
              <div className="col_2">{notification}</div>
            </div>
          ) : (
            <span className="ms-2">{text}</span>
          )}
        </div>
      </Link>
    </>
  );
}

export default LeftLink;
