import React from 'react';

function GridPost() {
  return (
    <div className="createPost mt-3">
      <div
        className="createPost_header"
        style={{ justifyContent: 'space-between' }}
      >
        <div className="left_header_grid">Posts</div>
        {/* <div className="flex">
          <div className="gray_btn">
            <i className="equalize_icon"></i>
          </div>
          <div className="gray_btn">
            <i className="manage_icon"></i>
            Manage Posts
          </div>
        </div> */}
      </div>

      <div className="create_splitter"></div>
      <div className="createPost_body grid2">
        <div className="view_type active">
          <i className="list_icon filter_green"></i>
          List view
        </div>
        <div className="view_type">
          <i className="grid_icon"></i>
          Grid View
        </div>
      </div>
    </div>
  );
}

export default GridPost;
