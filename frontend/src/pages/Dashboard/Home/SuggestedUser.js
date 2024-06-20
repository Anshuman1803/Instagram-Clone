import defaultProfile from "../../../Assets/DefaultProfile.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import homeStyle from "./home.module.css"
export function SuggestedUser({ data}) {
    const { instaUserName } = useSelector((state) => state.Instagram);
    return (
        <div className={`${homeStyle.currentUserContainer_SuggestedUserBox}`}>
            <div className={`${homeStyle.currentUserContainer_currentUser}`}>
                <img
                    src={data?.userProfile ?? defaultProfile}
                    alt={`${instaUserName}'s profile`}
                    onError={(e) => {
                        e.target.src = `${defaultProfile}`;
                        e.onerror = null;
                    }}
                    className={`${homeStyle.currentUserBox_profile}`}
                />
                <p className={`${homeStyle.currentUserBox_userNameBox}`}>
                    <span className={`${homeStyle.SuggestedUserBox__userName}`}>{data?.userName}</span>
                    <span className={`${homeStyle.SuggestedUserBox__suggestText}`}>
                        Suggested for you
                    </span>
                </p>
            </div>
            <Link to={`/${data?._id}`} className={`${homeStyle.SuggestedUserBox__viewUserButton}`}>
                View
            </Link>
        </div>
    );
}
