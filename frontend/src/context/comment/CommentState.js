import commentContext from "./commentContext";
import { useContext } from "react";
import axios from "axios";
import userContext from "../users/userContext";
const CommentState = (props) => {
  const usercontext = useContext(userContext);
  const { User } = usercontext;
  let token = localStorage.getItem("comment_system");
  const fetchComment = async (pageId, setBackendComments) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/comments/allcomments",
        {
          params: { pageId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
        console.log(response.data);
      if (response.status === 200) {
        setBackendComments(response.data);
      }else{
        console.log("Thier is error from server side :");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async (
    body,
    parentId = null,
    rootparentId = null,
    setActiveComment,
    pageId,
    setBackendComments
  ) => {
    let userId = User.id;
    let username = User.username;
    let createdAt = new Date().toISOString();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/comments/add",
        { body, username, userId, parentId, createdAt, rootparentId, pageId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      if (response.status === 200) {
        console.log("Comment created");
      } else {
        console.log("Comment is not created");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
    fetchComment(pageId, setBackendComments);
    setActiveComment(null);
  };

  const updateComment = async (
    body,
    id,
    deleted = false,
    setActiveComment,
    pageId,
    setBackendComments
  ) => {
    let createdAt = new Date().toISOString();

    try {
      const response = await axios.put(
        "http://localhost:3000/api/comments/update",
        { body, id, createdAt, deleted },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Comment Updated");
      } else {
        console.log("Comment not Updated");
      }
      fetchComment(pageId, setBackendComments);
      setActiveComment(null);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };
  const deleteComment = async (
    id,
    setActiveComment,
    pageId,
    setBackendComments
  ) => {
    let body = "This comment was deleted";
    updateComment(body, id, true, setActiveComment, pageId, setBackendComments);
  };

  const reportComment = async (id, backendComments, setBackendComments) => {
    const userId = User.id;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/comments/report",
        { id, userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        let commment = response.data;
        const updatedBackendComments = backendComments.map((backendComment) => {
          if (backendComment.id === commment.id) {
            return { ...backendComment, spam: commment.spam };
          }
          return backendComment;
        });
        setBackendComments(updatedBackendComments);
      } else if (response.status === 201) {
        console.log("Unauthorized");
      }else{

        console.log("Their is issue in server side");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleLikeClick = async (id) => {
    let userId = User.id;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/likes/like",
        { id, userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };
  const findTotalreply = (rootId, backendComments) => {
    let reply = 0;
    for (let i = 0; i < backendComments.length; i++) {
      if (backendComments[i].rootparentId === rootId) reply++;
    }

    return reply;
  };

  const getReplies = (commentId, backendComments) =>
    backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  return (
    <commentContext.Provider
      value={{
        fetchComment,
        deleteComment,
        addComment,
        updateComment,
        reportComment,
        handleLikeClick,
        findTotalreply,
        getReplies,
      }}
    >
      {props.children}
    </commentContext.Provider>
  );
};

export default CommentState;
