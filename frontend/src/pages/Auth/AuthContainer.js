import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import screenShotOne from "../../Assets/screenshot1.png";
import screenShotTwo from "../../Assets/screenshot2.png";
import screenShotThree from "../../Assets/screenshot3.png";
import screenShotFour from "../../Assets/screenshot4.png";
import { HiInformationCircle } from "react-icons/hi2";

import authStyle from "./auth.module.css";
import UserGuide from "./UserGuide";
function AuthContainer() {
  const { pathname } = useLocation();
  const navigateTO = useNavigate();
  const [showGuide, setShowGuide] = useState(false);

  const images = [screenShotOne, screenShotTwo, screenShotThree, screenShotFour];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (pathname === "/") {
      navigateTO("/user/auth/signin");
    }
  }, [pathname, navigateTO]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex === images.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 8000);

    return () => clearInterval(intervalId);
  }, [currentIndex, images.length]);

  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  return (
    <section className={`${authStyle.userAuth__container} ${showGuide && `${authStyle.__scrollwidthNONE}`}`}>
      <div className={`${authStyle.authContainer__LeftSideContainer}`}>
        <div className={`${authStyle.LeftSideContainer__PosterBox}`}>
          <img
            src={images[currentIndex]}
            alt="homePhone-Screenshots"
            className={`${authStyle.PosterBox__dynamicImages}`}
          />
        </div>
      </div>

      <div className={`${authStyle.authContainer__RightSideContainer}`}>
        <Outlet />
      </div>
      <button onClick={()=>setShowGuide(true)} title="App-Information" className={`${authStyle.__infoButton} ${showGuide && `${authStyle.__hideButton}`} `}>
        <HiInformationCircle className={`${authStyle.__infoButtonICON}`} />
      </button>

      {showGuide && <section className={`${authStyle.__userGuideBox}`}>
        <UserGuide onClose={handleCloseGuide} />
        </section>}
    </section>
  );
}

export default AuthContainer;
