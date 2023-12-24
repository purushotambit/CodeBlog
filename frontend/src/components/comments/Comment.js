import CommentForm from "./CommentForm";
import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import userContext from "../../context/users/userContext";
import commentContext from "../../context/comment/commentContext";
import reportContext from "../../context/reports/reportContext";
import likeContext from "../../context/likes/likeContext";
const Comment = ({
  comment,
  rootId,
  depth,
  replies,
  setActiveComment,
  activeComment,
  setBackendComments,
  backendComments,
  pageId,
}) => {
  const usercontext = useContext(userContext);
  const commentcontext = useContext(commentContext);
  const {
    addComment,
    updateComment,
    deleteComment,
    reportComment,
    handleLikeClick,
    findTotalreply,
    getReplies,
  } = commentcontext;
  const { User } = usercontext;
  const reportcontext = useContext(reportContext);
  const { CountCommentreport, Checkreported } = reportcontext;
  const likecontext = useContext(likeContext);
  const { CountCommentlikes } = likecontext;
  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";
  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "replying";
  const fiveMinutes = 300000;
  const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes;
  const canDelete = User.id === comment.userId;
  const moderator = false;
  const canReply =
    User.id !== comment.userId &&
    depth <= 4 &&
    findTotalreply(rootId, backendComments) < 50;

  const canEdit = moderator || (User.id === comment.userId && !timePassed);
  const canReport = User.id !== comment.userId;
  const createdAt = new Date(comment.createdAt).toLocaleDateString();
  const [like, setLike] = useState(0);
  const [report, setReport] = useState(0);
  const [reported, setReported] = useState(0);

  const login = localStorage.getItem("comment_system");

  useEffect(() => {
    CountCommentlikes(comment.id, setLike);
    CountCommentreport(comment.id, setReport);
    Checkreported(comment, setReported);
  }, []);

  return (
    <div key={comment.id} className="comment">
      <div className="comment-image-container">
        <img
          src="/user-icon.png"
          style={{ width: "30px", marginTop: "5px", marginRight: "0px" }}
        />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author">{comment.username}</div>

          <div style={{ marginTop: "5px" }}>{createdAt}</div>
        </div>
        {!isEditing &&
          (report < 5 ? (
            <div className="comment-text">
              {" "}
              {comment.deleted ? "This comment was deleted" : comment.body}
            </div>
          ) : (
            <div className="comment-text">
              This comment is hidden because of spam
            </div>
          ))}

        {isEditing && (
          <CommentForm
            submitLabel="Update"
            hasCancelButton
            initialText={comment.body}
            handleSubmit={(text) =>
              updateComment(
                text,
                comment.id,
                false,
                setActiveComment,
                pageId,
                setBackendComments
              )
            }
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}

        {login && report < 5 && !comment.deleted && (
          <div className="comment-actions">
            <button
              className="btn btn-dark btn-sm me-2"
              onClick={() => {
                handleLikeClick(comment.id);
                CountCommentlikes(comment.id, setLike);
              }}
            >
              <FontAwesomeIcon icon={faThumbsUp} size="1x" /> {like}
            </button>

            {canReply && (
              <div
                className="comment-action"
                onClick={() =>
                  setActiveComment({ id: comment.id, type: "replying" })
                }
              >
                Reply
              </div>
            )}
            {canEdit && (
              <div
                className="comment-action"
                onClick={() =>
                  setActiveComment({ id: comment.id, type: "editing" })
                }
              >
                Edit
              </div>
            )}
            {canDelete && (
              <div
                className="comment-action"
                onClick={() =>
                  deleteComment(
                    comment.id,
                    setActiveComment,
                    pageId,
                    setBackendComments
                  )
                }
              >
                Delete
              </div>
            )}

            {canReport && (
              <div
                className="comment-action"
                onClick={() => {
                  reportComment(
                    comment.id,
                    backendComments,
                    setBackendComments
                  );
                  Checkreported(comment, setReported);
                }}
              >
                {!reported && "Report"}
              </div>
            )}
          </div>
        )}

        {isReplying && (
          <CommentForm
            submitLabel="Reply"
            hasCancelButton
            handleSubmit={(text) =>
              addComment(
                text,
                comment.id,
                rootId,
                setActiveComment,
                pageId,
                setBackendComments
              )
            }
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}
        {replies.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <Comment
                key={reply.id}
                rootId={rootId}
                comment={reply}
                depth={depth + 1}
                replies={getReplies(reply.id, backendComments)}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                setBackendComments={setBackendComments}
                backendComments={backendComments}
                pageId={pageId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
