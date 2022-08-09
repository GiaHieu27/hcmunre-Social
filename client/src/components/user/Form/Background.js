function Background() {
  return (
    <>
      <div className="login_row content-row">
        <div className="login_col align-items-center flex-col">
          <div className="text sign-in">
            {/* <img
              src="../../icons/logoTNMT.svg"
              alt="logo"
              width={60}
              height={60}
            /> */}
            {/* <img src="../../icons/HCMUNRE.png" alt="" /> */}
            <h2>Chào mừng trở lại</h2>
            <p>kết nối và chia sẻ với mọi người trong cuộc sống của bạn.</p>
          </div>
          <div className="img sign-in">
            <img src="../../images/social-login2.svg" alt="welcome" />
          </div>
        </div>

        <div className="login_col align-items-center flex-col">
          <div className="img sign-up">
            <img src="../../images/social-login1.svg" alt="welcome" />
          </div>
          <div className="text sign-up">
            <h2>Tham gia với chúng tôi</h2>
            <p>kết nối và chia sẻ với mọi người trong cuộc sống của bạn.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Background;
