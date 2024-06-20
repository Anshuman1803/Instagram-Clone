import React from "react";
import searchStyle from "./search.module.css";

function SearchLoader() {
    const dummyArray = [111, 112, 113, 114, 115, 116, 117, 118, 119]
    return (
        <>
            {
                dummyArray.map((data) => {
                    return <div key={data} className={` ${searchStyle.__SearchShimmerCard}`}>
                        <div className={`${searchStyle.__SearchResult_Card_profileBox}`}>
                            <p className={`${searchStyle.__SearchShimmerCard_profile}  ${searchStyle.shimmerBg}`}
                            ></p>
                            <h4 className={`${searchStyle.__SearchResult_Card_username}`}>
                                <span
                                    className={`${searchStyle.__SearchShimmerCard_userName}  ${searchStyle.shimmerBg}`}
                                ></span>
                                <span
                                    className={`${searchStyle.__SearchShimmerCard_userName}  ${searchStyle.shimmerBg}`}
                                ></span>
                            </h4>
                        </div>
                        <div className={`${searchStyle.__SearchResult_Card_userDetails}`}>
                            <p className={`${searchStyle.__SearchShimmerCarduserInfo}`}>
                                <span
                                    className={`${searchStyle.__SearchShimmerCard_userName}  ${searchStyle.shimmerBg}`}
                                ></span>
                                <span
                                    className={`${searchStyle.__SearchShimmerCard_userName}  ${searchStyle.shimmerBg}`}
                                ></span>
                            </p>
                            <p className={`${searchStyle.__SearchShimmerCarduserInfo}`}>
                                <span
                                    className={`${searchStyle.__SearchShimmerCard_userName}  ${searchStyle.shimmerBg}`}
                                ></span>
                                <span
                                    className={`${searchStyle.__SearchShimmerCard_userName}  ${searchStyle.shimmerBg}`}
                                ></span>
                            </p>
                            <p className={`${searchStyle.__SearchShimmerCarduserInfo}`}>
                                <span
                                    className={`${searchStyle.__SearchShimmerCard_userName}  ${searchStyle.shimmerBg}`}
                                ></span>
                                <span
                                    className={`${searchStyle.__SearchShimmerCard_userName}  ${searchStyle.shimmerBg}`}
                                ></span>
                            </p>
                        </div>
                        <p
                            className={`${searchStyle.__SearchShimmerCardButton}  ${searchStyle.shimmerBg}`}
                        ></p>
                    </div>
                })
            }

        </>
    );
}

export default SearchLoader;
