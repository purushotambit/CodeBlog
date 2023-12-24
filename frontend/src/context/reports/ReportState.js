import reportContext from "./reportContext";
import { useContext } from "react";
import axios from "axios";
import userContext from "../users/userContext";
const ReportState = (props) => {
  const usercontext = useContext(userContext);
  const { User } = usercontext;
  let token = localStorage.getItem("comment_system");

  const CountCommentreport = async (commentId = null, setReport) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/comments/report_count",
        {
          params: { commentId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setReport(response.data);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const Checkreported = async (comment, setReported) => {
    const commentId = comment.id;
    const userId = User.id;

    try {
      const response = await axios.get(
        "http://localhost:3000/api/comments/reported",
        {
          params: { commentId, userId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //  console.log(response);
      if (response.status === 200) {
        setReported(response.data);
      }else{
        console.log("Their is issue from server side");
      }

     
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };
  return (
    <reportContext.Provider value={{ CountCommentreport, Checkreported }}>
      {props.children}
    </reportContext.Provider>
  );
};

export default ReportState;
