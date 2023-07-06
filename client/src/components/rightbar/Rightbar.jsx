import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
//import EditProfile from "../../pages/editProfile/editProfile";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const {logout} = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?.id)
  );

  const chemail = useRef();
  const chcity = useRef();
  
  const chfrom = useRef();
  const chrelationship = useRef();
  const history = useHistory();

  const newFriend = useRef();
  const newConver = useRef();

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const EditProfileChangeEmail = async (e) => {
    e.preventDefault();
    const chuser = {
      userId: user._id,
      email: chemail.current.value,
      
    };

    try {
      await axios.put(`/users/`+ user._id, chuser);
      history.push("/");
    } catch (err) {
      console.log(err);
    }

  }
  


  const EditProfileChangeCity = async (e) => {
    e.preventDefault();
    const chuser = {
      userId: user._id,
      city: chcity.current.value,
      
    };

    try {
      await axios.put(`/users/`+ user._id, chuser);
      history.push("/");
    } catch (err) {
      console.log(err);
    }

  }
  const EditProfileChangeFrom = async (e) => {
    e.preventDefault();
    const chuser = {
      userId: user._id,
      from: chfrom.current.value,
      
    };

    try {
      await axios.put(`/users/`+ user._id, chuser);
      history.push("/");
    } catch (err) {
      console.log(err);
    }

  }
  const EditProfileChangeRelationship = async (e) => {
    e.preventDefault();
    const chuser = {
      userId: user._id,
      relationship: chrelationship.current.value,
      
    };

    try {
      await axios.put(`/users/`+ user._id, chuser);
      history.push("/");
    } catch (err) {
      console.log(err);
    }

  }

  const MakeNewFriend = async (e) => {
    e.preventDefault();
    const nFriend = {
        userId: newFriend.current.value
    }

    try {
        await axios.put(`/users/${user._id}/follow`, nFriend);
        history.push("/");
    } catch (err) {
        console.log(err)
    }
}
  const handleLogOut = () => {
    logout();
  };

const MakeNewConversation = async (e) => {
    e.preventDefault();
    const nConver = {
      senderId: user._id,
      receiverId: newConver.current.value
    }
    try {
      await axios.post("/conversations/", nConver);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
}


  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}

            
            

        
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">UserId:</span>
            <span className="rightbarInfoValue">{user._id}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Email:</span>
            <span className="rightbarInfoValue">{user.email}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          
          <div className="rightbarInfoItem">
          
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 2
                ? "Married"
                : "-"}
            </span>
          </div>
          
          <div className="linkForChangeUserInfo">
              <h3>Make new Conversation</h3>
                <span className="editSpan">Add new friend</span>
                <form className="editForm" onSubmit={MakeNewFriend}>
                    <input
                        className="changeInput"
                        placeholder="Enter friend's email or id"
                        type="text"
                        ref={newFriend}
                    />
                    <button className="editButton">Submit</button>
                </form>
            </div>
            <div className="linkForChangeUserInfo">
                <span className="editSpan">Add new conversation</span>
                <form className="editForm" onSubmit={MakeNewConversation}>
                    <input 
                        className="changeInput"
                        placeholder="Enter friend's id or email"
                        type="text"
                        ref={newConver}
                    />
                    <button className="editButton">Submit</button>
                </form>
            </div>

          {user.username === currentUser.username && (
            <div className="linkForChangeUserInfo">
            <h3>Edit profile</h3>
            <form className="editForm" onSubmit={EditProfileChangeEmail}>
                <span className="editSpan">Change your email</span>
                <input
                  placeholder="Change email"
                  type="email"
                  className="changeInput"
                  ref={chemail}
                />
                <button className="editButton" type="submit">Submit</button>
            </form>
            


            <form className="editForm" onSubmit={EditProfileChangeCity}>
                <span className="editSpan">Change your city</span>
                <input
                  placeholder="Change city"
                  type="text"
                  className="changeInput"
                  ref={chcity}
                />
                <button className="editButton" type="submit">Submit</button>
            </form>
            <form className="editForm" onSubmit={EditProfileChangeFrom}>
                <span className="editSpan">Change your from</span>
                <input
                  placeholder="Change from"
                  type="text"
                  className="changeInput"
                  ref={chfrom}
                />
                <button className="editButton" type="submit">Submit</button>
            </form>
            <form className="editForm" onSubmit={EditProfileChangeRelationship}>
                <span className="editSpan">Change your relationship</span>
                <input
                  placeholder="Single (1) or Married (2)"
                  type="text"
                  className="changeInput"
                  ref={chrelationship}
                />
                <button className="editButton" type="submit">Submit</button>
            </form>
            <br/><span className="editSpan">Log Out from system</span>
            <button onClick={handleLogOut} className="editButton">Log out</button>
            <br/><span className="editSpan">Delete accaunt</span>
            <button onClick={handleLogOut} className="editButton">Delete</button>
          </div>
        )}
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

/* 

            const EditProfileChangeName = async (e) => {
              e.preventDefault();
              const chuser = {
                userId: user._id,
                username: chname.current.value,
                
              };

              try {
                await axios.put(`/users/`+ user._id, chuser);
                history.push("/");
              } catch (err) {
                console.log(err);
              }

            }

            <form className="editForm" onSubmit={EditProfileChangeName}>
                <input
                  placeholder="Change username"
                  type="text"
                  className="changeInput"
                  ref={chname}
                />
                <button className="editButton" type="submit">Submit</button>
            </form>

*/