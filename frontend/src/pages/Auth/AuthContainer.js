import React, { useState, useEffect } from "react";
import {Outlet} from 'react-router-dom'
import screenShotOne from "../../Assets/screenshot1.png";
import screenShotTwo from "../../Assets/screenshot2.png";
import screenShotThree from "../../Assets/screenshot3.png";
import screenShotFour from "../../Assets/screenshot4.png";

function AuthContainer() {
  const images = [
    screenShotOne,
    screenShotTwo,
    screenShotThree,
    screenShotFour,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

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
  return (
    <section className="userAuth__container">
      <div className="authContainer__LeftSideContainer">
        <div className="LeftSideContainer__PosterBox">
          <img
            src={images[currentIndex]}
            alt="homePhone-Screenshots"
            className="PosterBox__dynamicImages"
          />
        </div>
      </div>
      
      <div className="authContainer__RightSideContainer">
        <Outlet/>
      </div>
    </section>
  );
}

export default AuthContainer;
