import likeContext from "./likeContext";
import axios from "axios";
const LikeState = (props) => {
  let token = localStorage.getItem("comment_system");
  const CountCommentlikes = async (commentId = null, setLike) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/comments/like_count",
        {
          params: { commentId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setLike(response.data);
      }else {

        console.log("Their is an issue from server side");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <likeContext.Provider value={{ CountCommentlikes }}>
      {props.children}
    </likeContext.Provider>
  );
};

export default LikeState;
