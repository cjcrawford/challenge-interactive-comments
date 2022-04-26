import { reactive, computed } from "vue";
import { user, isLoggedIn } from "./useAuth.js";
import { mockApiCall } from "./useAsync.js";
import { replaceFirstUsername } from "../util/sanitize.js";
import commentData from "../data.json";

const localData = localStorage.getItem("comments");

export const comments = reactive(
  localData ? JSON.parse(localData) : commentData.comments
);

const nextCommentId = computed(() => {
  const maxId = comments.reduce((currentHighestCommentId, comment) => {
    const highestReplyId = comment.replies.reduce((maxId, reply) => {
      return reply.id < currentHighestCommentId
        ? currentHighestCommentId
        : reply.id;
    }, currentHighestCommentId);

    return comment.id < highestReplyId ? highestReplyId : comment.id;
  }, 1);

  return maxId + 1;
});

const persistLocalStorage = () => {
  localStorage.setItem("comments", JSON.stringify(comments));
  localStorage.setItem("user", JSON.stringify(user));
};

export const resetLocalStorage = () => {
  localStorage.clear();
  comments.value = commentData.comments;
};

export const addReply = async (content, comment, parent) => {
  if (!isLoggedIn) {
    // IRL we might temporarily store the reply in session then
    // redirect to a login page, then redirect them back to the previous page
    throw new Error("you must be logged in to reply");
  }

  // shape the reply (IRL the API would probably do this)
  const newReply = {
    id: nextCommentId.value,
    content: replaceFirstUsername(content, comment.user.username),
    createdAt: "just now",
    score: 1,
    replyingTo: comment.user.username,
    user,
  };

  console.log(newReply);

  // @todo: API call
  await mockApiCall();

  // IRL we would not push the reply here and instead re-trigger the API fetch
  // or just retrieve all replies back to update the entire reply section
  const commentIndex = comments.findIndex(({ id }) => id === parent.id);
  comments[commentIndex].replies.push(newReply);

  persistLocalStorage();

  return Promise.resolve();
};

export const addComment = async (content) => {
  if (!isLoggedIn) {
    // IRL we might temporarily store the comment in session then
    // redirect to a login page, then redirect them back to the previous page
    throw new Error("you must be logged in to comment");
  }

  // shape the comment (IRL the API would probably do this)
  const newComment = {
    id: nextCommentId.value,
    content,
    replies: [],
    createdAt: "just now",
    score: 1,
    user,
  };

  // @todo: API call
  await mockApiCall();

  // IRL we would not push the comment here and instead re-trigger the API fetch
  // or just retrieve all replies back to update the entire reply section
  comments.push(newComment);

  persistLocalStorage();

  return Promise.resolve();
};

export const updateComment = async (content, comment, parent) => {
  // @todo: API call
  await mockApiCall();

  comment.content = replaceFirstUsername(
    content,
    parent.replyingTo || comment.replyingTo
  );

  persistLocalStorage();

  return Promise.resolve();
};

const deleteReply = async (comment, parent) => {
  const replyIndex = parent.replies.findIndex(({ id }) => id === comment.id);
  if (replyIndex === -1) {
    return Promise.reject(new Error("This reply has already been deleted"));
  }

  await mockApiCall();

  parent.replies.splice(replyIndex, 1);

  persistLocalStorage();

  return Promise.resolve();
};

export const deleteComment = async (comment, parent) => {
  // @todo: API call
  await mockApiCall();

  if (parent) {
    return deleteReply(comment, parent);
  }

  const commentIndex = comments.findIndex(({ id }) => id === comment.id);
  if (commentIndex === -1) {
    return Promise.reject(new Error("This comment has already been deleted"));
  }

  comments.splice(commentIndex, 1);

  persistLocalStorage();

  return Promise.resolve();
};

export const vote = async (comment, score) => {
  if (!isLoggedIn) {
    throw new Error("you must be logged in to vote");
  }

  if (![1, -1].includes(score)) {
    throw new Error("score must be 1 or -1");
  }

  const { id } = comment;

  if (user.commentVotes[id] && user.commentVotes[id] === score) {
    throw new Error("cannot vote more than once in the same direction");
  }

  await mockApiCall();

  // track logged in user's vote, if no vote exists, use 0 score
  user.commentVotes[id] = (user.commentVotes[id] || 0) + score;

  // update the comment score
  comment.score += score;

  persistLocalStorage();

  return Promise.resolve();
};
