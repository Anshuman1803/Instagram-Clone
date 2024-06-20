import React, { useEffect, useState } from "react";
import defaultProfile from "../../../Assets/DefaultProfile.png";
import axios from "axios";
import toast from "react-hot-toast";
import PostLoader from "../../../components/PostLoader";
import { RiUserSettingsFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut } from "../../../Redux/ReduxSlice";
import { HomePostCard } from "./HomeCard";
import { SuggestedUser } from "./SuggestedUser";
import homeStyle from "./home.module.css"
export default function Home() {
  const dispatch = useDispatch();
  const navigateTO = useNavigate();
  const { instaUserID, instaProfle, instaUserName, instaFullName, instaTOKEN } =
    useSelector((state) => state.Instagram);
  const [PostLoading, setPostLoading] = useState(false);
  const [suggestedUser, setSuggestedUser] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  const loadAllData = () => {
    setPostLoading(true);
    const headers = {
      Authorization: `Bearer ${instaTOKEN}`,
    };

    Promise.all([
      axios.get(`http://localhost:5000/api/v1/posts/get-all/${instaUserID}`, {
        headers,
      }),
      axios.get(
        `http://localhost:5000/api/v1/auth/user/suggested-users/${instaUserID}`,
        { headers }
      ),
    ])
      .then(([postsResponse, suggestedUsersResponse]) => {
        if (postsResponse.data.success) {
          setAllPosts(
            postsResponse.data.posts.sort(
              (a, b) => b.postCreatedAt - a.postCreatedAt
            )
          );
        } else {
          setAllPosts(postsResponse.data.posts);
        }

        if (suggestedUsersResponse.data.success) {
          setSuggestedUser(suggestedUsersResponse.data.suggestedUser);
        } else {
          setSuggestedUser(suggestedUsersResponse.data.suggestedUser);
        }
        setPostLoading(false);
      })
      .catch((error) => {
        if (error.response && !error.response.data.success) {
          toast.error(error.response.data.msg);
          navigateTO("/user/auth/signin");
          dispatch(UserLoggedOut());
        } else {
          toast.error(`Server error: ${error.message}`);
        }
        setPostLoading(false);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadAllData, []);

  return (
    <section className={`${homeStyle.dashboard__homeSection}`}>
      <div className={`${homeStyle.homeSection__ShowPostContainer}`}>
        {PostLoading ? (
          <PostLoader />
        ) : (
          <>
            {allPosts.map((posts, index) => {
              return <HomePostCard key={posts._id + index} posts={posts} />;
            })}
          </>
        )}
      </div>
      <aside className={`${homeStyle.homeSection__currentUserContainer}`}>
        <div className={`${homeStyle.currentUserContainer_currentUserBox}`}>
          <div className={`${homeStyle.currentUserContainer_currentUser}`}>
            <img
              src={instaProfle ?? defaultProfile}
              alt={`${instaUserName}'s profile`}
              onError={(e) => {
                e.target.src = `${defaultProfile}`;
                e.onerror = null;
              }}
              className={`${homeStyle.currentUserBox_profile}`}
            />
            <p className={`${homeStyle.currentUserBox_userNameBox}`}>
              <Link to={`/${instaUserID}`} className={`${homeStyle.currentUserBox__userName}`}>
                {instaUserName}
              </Link>
              <span className={`${homeStyle.currentUserBox__userFullName}`}>
                {instaFullName}
              </span>
            </p>
          </div>
          <RiUserSettingsFill className={`${homeStyle.currentUserBox__userSettingICON}`} onClick={() => navigateTO("/Accout/setting/edit-profile")} />
        </div>

        <div className={`${homeStyle.homeSection__suggestedUserContainer}`}>
          <h2 className={`${homeStyle.suggestedUserContainer__heading}`}>Suggested for you</h2>
          {suggestedUser?.map((data) => {
            return (
              <SuggestedUser data={data} key={data._id} />
            );
          })}
        </div>
      </aside>
    </section>
  );
}

