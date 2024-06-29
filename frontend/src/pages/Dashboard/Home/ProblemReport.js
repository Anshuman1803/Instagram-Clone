import React, { useState } from "react";
import homeStyle from "./home.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ButtonLoader from "../../../components/ButtonLoader"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export function ProblemReport() {
  const { instaUserID } = useSelector((state) => state.Instagram);
  const [reportDetails, setReportDetails] = useState({
    subject: "report",
    message: "",
  });
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setReportDetails({ ...reportDetails, [e.target.name]: e.target.value });
  };

  const handleSendReport = (e) => {
    e.preventDefault();
    setLoading(true)
    axios
      .post(`${BACKEND_URL}send/reportorfeedback/${instaUserID}`, reportDetails)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.msg);
          setReportDetails({
            subject: "report",
            message: "",
          })
          setLoading(false)
        } else {
          toast.error(response.data.msg);
          setReportDetails({
            subject: "report",
            message: "",
          })
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false)
      });
  };
  return (
    <section className={`${homeStyle.__problemReportContainer}`}>
      <form className={`${homeStyle.__problemReportBox}`}>
        <div className={`${homeStyle.__problemReportBox__Row}`}>
          <label
            className={`${homeStyle.__problemReportBox_label}`}
            htmlFor="subject"
          >
            Subject
          </label>
          <p className={`${homeStyle.__problemReportBox_item}`}>
            <input
              type="radio"
              onChange={handleChange}
              value="report"
              name="subject"
              id="subject"
              checked={reportDetails.subject === "report"}
            />
            <label htmlFor="subject"> Report a problem</label>
            Report a problem
          </p>
          <p className={`${homeStyle.__problemReportBox_item}`}>
            <input
              type="radio"
              onChange={handleChange}
              value="feedback"
              name="subject"
              id="subject2"
              checked={reportDetails.subject === "feedback"}
            />
            <label htmlFor="subject2"> Feedback</label>
          </p>
        </div>
        <textarea
          name="message"
          value={reportDetails.message}
          onChange={handleChange}
          placeholder={reportDetails.subject === "feedback" ? "Give the honest feedback" : "Describe the problem you are experiencing"}
          className={`${homeStyle.__problemReportBox_Messageitem}`}
        >
        </textarea>

        <button className={`${homeStyle.__problemReportBox_button} ${reportDetails.message === "" && "Unactive"} ${loading && "Unactive"}`} type="button" onClick={handleSendReport}>
          {
            loading ? <ButtonLoader /> : "Send"
          }
        </button>
        <span className={`${homeStyle.__problemReportBox_msginfo}`}>
          Your Instagram username and Email address will be automatically included
          in your report.
        </span>
      </form>
    </section>
  );
}
