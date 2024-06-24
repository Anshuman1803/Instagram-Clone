import React, { useState } from 'react'
import { CgSearch } from "react-icons/cg";
import defaultPicture from "../../../Assets/DefaultProfile.png"
import axios from 'axios'
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut } from "../../../Redux/ReduxSlice";
import { Link, useNavigate } from 'react-router-dom';
import SearchLoader from './SearchLoader';
import searchStyle from "./search.module.css"
export default function Search() {
  const { instaTOKEN } = useSelector((state) => state.Instagram);
  const dispatch = useDispatch();
  const navigateTO = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoader] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [defaultMessage, setDefaultMessage] = useState("Looking for someone? Start typing their name...")
  const headers = {
    Authorization: `Bearer ${instaTOKEN}`,
  };

  const loadSearchResult = () => {
    setSearchLoader(true)
    axios.post("http://localhost:5000/api/v1/auth/users/search-user", { searchText }, { headers }).then((response) => {
      if (response.data.success) {
        setSearchResult(response.data.searchResult);
        setSearchLoader(false);
      } else {
        setSearchResult(response.data.searchResult);
        setSearchLoader(false);
        setDefaultMessage('No users found matching your search')
      }
    }).catch((error) => {
      if (error.response && !error.response.data.success) {
        toast.error(error.response.data.msg);
        navigateTO("/user/auth/signin");
        dispatch(UserLoggedOut());
      } else {
        toast.error(`Server error: ${error.message}`);
      }
      setSearchLoader(false);
    });
  }

  const handleSearchResultClick = (e) => {
    e.preventDefault();
    if (searchText.length === 0) {
      toast.error("Please enter a search text");
    } else {
      loadSearchResult();
    }

  }
  const handleEnterKey = (e) => {
    if (e.keyCode === 13) {
      if (searchText.length === 0) {
        toast.error("Please enter a search text");
      } else {
        loadSearchResult();
      }
    }

  }
  return (
    <section className={`${searchStyle.__SearchContainer}`}>
      <header className={`${searchStyle.__SearchContainer__headerContainer}`}>
        <form className={`${searchStyle.__serachbar_FormBox}`} onSubmit={(e) => e.preventDefault()}>
          <input type="text" onKeyDown={handleEnterKey} autoFocus='on' name='searchText' id='searchText' value={searchText} onChange={(e) => setSearchText(e.target.value)} autoComplete='off' className={`${searchStyle.__Searchbar_input}`} placeholder="Search by user's full name or username" />
          <button type='button' onClick={handleSearchResultClick} className={`${searchStyle.__Searchbutton}`}><CgSearch className={`${searchStyle.__SearchbuttonICON}`} /></button>
        </form>
      </header>

      <div className={`${searchStyle.__SearchResult_Container}`}>
        {
          searchLoading ? <SearchLoader /> : <>
            {
              searchResult.length === 0 ? <p className={`${searchStyle.__SerchResult__DefaultMessage}`}>{defaultMessage}</p> :
                <>
                  {
                    searchResult.map((data) => {
                      return <div className={`${searchStyle.__SearchResult__Card}`} key={data._id}>
                        <div className={`${searchStyle.__SearchResult_Card_profileBox}`}>
                          <img src={data?.userProfile ?? defaultPicture} alt='userProfile' className={`${searchStyle.__searchResult_Card_Profile}`} onError={(e) => { e.target.src = `${defaultPicture}`; e.onerror = null; }} />
                          <h4 className={`${searchStyle.__SearchResult_Card_username}`}>
                            {data?.userName}
                            <span className={`${searchStyle.__SearchResult_Card_FullName}`}>{data?.fullName}</span>
                          </h4>
                        </div>

                        <div className={`${searchStyle.__SearchResult_Card_userDetails}`}>
                          <p className={`${searchStyle.__SearchResult_Card_userInfo}`}>
                            posts <span className={`${searchStyle.__SearchResult_Card_Numberdata}`}>{data?.userPostsCount}</span>
                          </p>
                          <p className={`${searchStyle.__SearchResult_Card_userInfo}`}>
                            followers <span className={`${searchStyle.__SearchResult_Card_Numberdata}`}>{data?.userFollowers.length}</span>
                          </p>
                          <p className={`${searchStyle.__SearchResult_Card_userInfo}`}>
                            following <span className={`${searchStyle.__SearchResult_Card_Numberdata}`}>{data?.userFollowing.length}</span>
                          </p>
                        </div>

                        <Link to={`/${data?._id}`} className={`${searchStyle.__SearchResult_Card_viewProfileButton}`}>View Profile</Link>
                      </div>
                    })
                  }
                </>
            }
          </>
        }
      </div>
    </section>
  )
}
