import { useState, useEffect, useContext } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

import commentContext from "../../context/comment/commentContext";

const Comments = ({ pageId }) => {
  const commentcontext = useContext(commentContext);
  const { fetchComment, addComment, getReplies } = commentcontext;
  const [backendComments, setBackendComments] = useState([]);

  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );
    
  const [activeComment, setActiveComment] = useState(null);
  useEffect(() => {
    fetchComment(pageId, setBackendComments).then(
      // eslint-disable-next-line
      
    );
  }, []);

  return (
    <div className="comments body">
      {localStorage.getItem("comment_system") ? (
        <div className="comment-form-title">Write comment</div>
      ) : null}

      {localStorage.getItem("comment_system") && (
        <CommentForm
          submitLabel="Write"
          handleSubmit={(text) =>
            addComment(
              text,
              null,
              null,
              setActiveComment,
              pageId,
              setBackendComments
            )
          }
        />
      )}
      <h5 className="comments-title">Comments</h5>
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            key={rootComment.id}
            rootId={rootComment.id}
            comment={rootComment}
            depth={0}
            replies={getReplies(rootComment.id, backendComments)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            setBackendComments={setBackendComments}
            backendComments={backendComments}
            pageId={pageId}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
