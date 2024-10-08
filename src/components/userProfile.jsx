import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "./Loading.jsx";
import Post from "./Post.jsx";
import { serverUrl } from "../config.js";
import { TokenContext } from "../App.jsx";
import UserProfileStyles from "../css-modules/userProfile.module.css";

export default function UserProfile() {
  const [result, setResult] = useState(null);
  let profile;
  let posts;
  let clientId;
  if (result) {
    profile = result.profile;
    posts = result.posts;
    clientId = result.clientId;
  }
  const { token } = useContext(TokenContext);
  const navigate = useNavigate();
  const { state: userId } = useLocation();

  // fetching the profile of the user
  useEffect(() => {
    fetch(`${serverUrl}/user/users/profile?userId=${userId}`, {
      method: "GET",
      headers: {
        auth: token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          navigate("/serverError");
        }
      })
      .then((result) => {
        setResult(result);
      });
  }, []);

  return (
    <div className={UserProfileStyles["container"]}>
      {result ? (
        <>
          <div className={UserProfileStyles["user-profile"]}>
            <h2>{profile.username}</h2>
            <img src={profile.profile.image} />
            <p>
              <span>First Name:</span> {profile.firstName}
            </p>
            <p>
              <span>Last Name:</span> {profile.lastName}
            </p>
            <p>{profile.profile.bio}</p>
          </div>
          <div className={UserProfileStyles["user-posts"]}>
            <h2>{profile.username} posts</h2>
            {posts.map((post) => {
              return <Post post={post} clientId={clientId} key={post.id} />;
            })}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
