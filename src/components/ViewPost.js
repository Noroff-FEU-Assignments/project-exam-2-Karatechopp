import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_API } from "../constants/api";
import { getProfileName, getToken } from "../common/LocalStorage";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import DisplayMessage from "../common/DisplayMessage";
import EmojiPicker from "emoji-picker-react";

function ViewPost() {
  const [postData, setPostData] = useState([]);
  const [mainComments, setMainComments] = useState([]);
  const [replyToId, setReplyToId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emojiDropdownVisible, setEmojiDropdownVisible] = useState(false);
  const emojiDropdownRef = useRef(null);
  const location = useLocation();
  const token = getToken();
  const queryParams = new URLSearchParams(location.search);
  const postIdQuery = queryParams.get("id");
  const url = BASE_API + "posts/" + postIdQuery + "?_author=true&_reactions=true&_comments=true";

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const getPostById = useCallback(async () => {
    try {
      const response = await axios.get(url);
      setPostData(response.data);

      const allComments = response.data.comments;

      const main = [];
      const replyComments = {};

      allComments.forEach((comment) => {
        if (comment.replyToId === null) {
          main.push(comment);
        } else {
          if (!replyComments[comment.replyToId]) {
            replyComments[comment.replyToId] = [];
          }
          replyComments[comment.replyToId].push(comment);
        }
      });

      main.forEach((comment) => {
        if (replyComments[comment.id]) {
          comment.replies = replyComments[comment.id];
        }
      });

      setMainComments(main);
      setLoading(false);
    } catch (error) {
      setError(error.toString());
    }
  }, [url]);

  const {
    register: commentRegister,
    handleSubmit: handleCommentSubmit,
    formState: { errors: commentErrors },
    reset: resetCommentForm,
  } = useForm();

  const {
    register: replyRegister,
    handleSubmit: handleReplySubmit,
    formState: { errors: replyErrors },
    reset: resetReplyForm,
  } = useForm();

  async function createComment(data) {
    const comment = {
      body: data.comment,
    };
    try {
      const response = await axios.post(BASE_API + "posts/" + postIdQuery + "/comment", comment);
      if (response.status === 200) {
        getPostById();
        resetCommentForm();
      }
    } catch (error) {
      setError(error.toString());
    }
  }

  async function createReplyComment(data) {
    const reply = {
      body: data.reply,
      replyToId: replyToId,
    };
    try {
      const response = await axios.post(BASE_API + "posts/" + postIdQuery + "/comment", reply);
      if (response.status === 200) {
        setReplyToId(null);
        getPostById();
        resetReplyForm();
      }
    } catch (error) {
      setError(error.toString());
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiDropdownRef.current && !emojiDropdownRef.current.contains(event.target)) {
        setEmojiDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function onEmojiClick(emojiData) {
    setEmojiDropdownVisible(false);
    try {
      const response = await axios.put(BASE_API + "posts/" + postData.id + "/react/" + emojiData.emoji);
      if (response.status === 200) {
        getPostById();
      }
    } catch (error) {
      setError(error.toString());
    }
  }

  useEffect(() => {
    getPostById();
  }, [getPostById]);

  if (loading) {
    return <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 h-screen">An error occured: {error}</div>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 h-screen">
        <div className="text-gray-900 dark:text-white bg-white dark:bg-gray-900 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{postData.title}</h2>
            <div className="text-gray-500 text-sm">{new Date(postData.created).toLocaleDateString()}</div>
          </div>
          <pre className="text-gray-900 text-lg dark:text-white font-sans whitespace-pre-wrap">{postData.body}</pre>
          {postData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {postData.tags.map((tag, index) => (
                <span key={index} className="text-white bg-gray-900 dark:text-gray-900 dark:bg-white px-1 py-0.5 rounded-md text-sm font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {postData.media && <img src={postData.media} alt="Post media" className="mx-auto max-w-full h-auto mt-4" />}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to={"/Profile?name=" + postData.author.name}>
                {postData.author.avatar ? (
                  <img src={postData.author.avatar} alt="Author avatar" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 mx-auto flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">?</span>
                  </div>
                )}
              </Link>
              <div className="ml-2">
                <Link to={"/Profile?name=" + postData.author.name}>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg text-left">{postData.author.name}</p>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">Updated: {new Date(postData.updated).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="relative" ref={emojiDropdownRef}>
              <button
                onClick={() => setEmojiDropdownVisible(!emojiDropdownVisible)}
                className="my-5 block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg p-2 text-center"
              >
                React
              </button>
              {emojiDropdownVisible && (
                <div className="absolute top-0 right-0 p-2">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    height={400}
                    searchDisabled
                    previewConfig={{
                      showPreview: false,
                    }}
                    width={300}
                    className="mt-4"
                    theme="auto"
                  />
                </div>
              )}
            </div>
          </div>
          {postData.reactions && <p className="text-xl">{postData.reactions.map((reaction) => reaction.symbol).join(" ")}</p>}

          {postData.author.name === getProfileName() && (
            <div className="flex justify-center items-center m-0">
              <Link to={"/EditPost?id=" + postData.id}>
                <button className="my-2 mx-auto text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-4 py-1.5 text-center">
                  Edit post
                </button>
              </Link>
            </div>
          )}

          <div>
            <form className="flex flex-col justify-between items-center" onSubmit={handleCommentSubmit(createComment)}>
              <label>Comment on post</label>
              {commentErrors.comment && <DisplayMessage messageType="error">Comment cannot be empty</DisplayMessage>}
              <textarea
                type="text"
                placeholder="Comment"
                className="w-full resize-none px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onInput={(event) => {
                  event.target.style.height = "auto";
                  event.target.style.height = event.target.scrollHeight + 5 + "px";
                }}
                {...commentRegister("comment", { required: true })}
              />
              <button
                type="submit"
                className="mt-2 text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-4 py-1.5 text-center"
              >
                Send
              </button>
            </form>

            <div>
              <h3 className="text-xl font-semibold text-center m-4">Comments</h3>
              {mainComments.length > 0 ? (
                mainComments.map((comment) => (
                  <div key={comment.id} className="bg-white dark:bg-gray-900 p-4 space-y-4 border border-gray-500 mb-4 rounded">
                    <div className="flex justify-between items-center">
                      <Link to={"/Profile?name=" + comment.author.name}>
                        <div className="flex items-center">
                          {comment.author.avatar ? (
                            <img src={comment.author.avatar} alt="Author avatar" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-700 mx-auto flex items-center justify-center">
                              <span className="text-white text-xl font-semibold">?</span>
                            </div>
                          )}
                          <p className="ml-2 text-gray-700 dark:text-gray-300 font-semibold text-lg">{comment.author.name}</p>
                        </div>
                      </Link>
                      <div className="text-gray-500 text-sm">{new Date(comment.created).toLocaleString()}</div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{comment.body}</p>
                    {replyToId !== comment.id && (
                      <button onClick={() => setReplyToId(comment.id)} className="text-blue-500 dark:text-blue-400 text-sm focus:outline-none hover:underline">
                        Reply
                      </button>
                    )}
                    {replyToId === comment.id && (
                      <div className="mt-2">
                        <form onSubmit={handleReplySubmit(createReplyComment)}>
                          {replyErrors.reply && <DisplayMessage messageType="error">Reply cannot be empty</DisplayMessage>}
                          <input
                            type="text"
                            placeholder="Reply"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            {...replyRegister("reply", { required: true })}
                          />

                          <button
                            type="submit"
                            className="mt-2 text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-4 py-1.5 text-center"
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    )}
                    {comment.replies &&
                      comment.replies.map((reply) => (
                        <div key={reply.id} className="ml-6">
                          <div className="-mt-2">|</div>
                          <div className="flex justify-between items-center">
                            <Link to={"/Profile?name=" + reply.author.name}>
                              <div className="flex items-center">
                                {reply.author.avatar ? (
                                  <img src={reply.author.avatar} alt="Author avatar" className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-700 mx-auto flex items-center justify-center">
                                    <span className="text-white text-xl font-semibold">?</span>
                                  </div>
                                )}

                                <p className="ml-2 text-gray-700 dark:text-gray-300 font-semibold text-lg">{reply.author.name}</p>
                              </div>
                            </Link>
                            <div className="text-gray-500 text-sm">{new Date(reply.created).toLocaleString()}</div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">{reply.body}</p>
                        </div>
                      ))}
                  </div>
                ))
              ) : (
                <div>No comments</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewPost;
