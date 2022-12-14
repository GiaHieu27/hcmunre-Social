import PropTypes from 'prop-types';

function CreatePost({ user, setVisible, profile }) {
  return (
    <div className={`createPost ${profile ? 'mt-3' : ''}`}>
      <div className="createPost_header">
        <img src={user?.picture} alt="" />
        <div
          className="open_post hover2"
          onClick={() => {
            setVisible(true);
          }}
        >
          Đăng bài viết tại đây nhé {user?.last_name}
        </div>
      </div>
    </div>
  );
}

CreatePost.propTypes = {
  user: PropTypes.object,
  setVisible: PropTypes.func,
};

export default CreatePost;
