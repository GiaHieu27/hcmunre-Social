import { Photo } from "../../../svg";

function AddYourPost(props) {
  console.log(!props.images);
  return (
    <div className="addtoyourpost">
      <div className="addto_text">Thêm vào bài viết</div>
      <div className="d-flex flex-row ">
        <div
          className="post_header_right hover1"
          style={{
            cursor: `${props.background ? "not-allowed" : "pointer"}`,
          }}
          onClick={() => {
            if (!props.background) props.setShowPrev(!props.showPrev);
          }}
        >
          <Photo color={`${props.background ? "#b0b3b8" : "#20a305"}`} />
        </div>

        <div
          className="post_header_right"
          style={{
            cursor: `${
              (props.images && props.images.length) ||
              (props.videos && props.videos.length)
                ? "not-allowed"
                : "pointer"
            }`,
          }}
        >
          <img
            src="/icons/colorful.png"
            alt="pick-background-color"
            width={35}
            onClick={() => {
              if (!props.images.length || !props.videos.length) {
                props.setShowBg(!props.showBg);
              }
            }}
          />
        </div>
        <div className="post_header_right">
          <i
            className={`emoji_icon_large`}
            onClick={() => {
              props.setPicker(!props.picker);
            }}
          ></i>
        </div>
      </div>
    </div>
  );
}

export default AddYourPost;
