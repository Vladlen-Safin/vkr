import "./NConverStyle.css";
import {Users} from "../../dummyData";
import { useContext, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";


export default function NewConver({user}){

    const {user:currentUser, dispath} = useContext(AuthContext);
    const history = useHistory();
    const newFriend = useRef();
    const newConver = useRef();

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

    const MakeNewConversation = async (e) => {
        e.preventDefault();
        const nConversation = {
            senderId: user._id,
            receiverId: newConver.current.value
        }

        try {
            await axios.post("/conversations/", nConversation);
            history.push("/login");
        } catch (err) {
            console.log(err);
        }
    }   

    return(
        <>
            <h3>Make new Conversation</h3>
            <div className="makeNewFriend">
                <h2>Add new friend</h2>
                <form className="newFriendForm">
                    <input 
                        onSubmit={MakeNewFriend}
                        className="newFriendFromInput"
                        placeholder="Enter friend's email"
                        type="email"
                        ref={newFriend}
                    />
                    <button className="newFriendFromButton">Submit</button>
                </form>
            </div>
            <div className="makeNewConversation">
                <h2>Add new conversation</h2>
                <form className="newConversationForm">
                    <input 
                        onSubmit={MakeNewConversation}
                        className="newConversationFromInput"
                        placeholder="Enter friend's id or email"
                        type="text"
                        ref={newConver}
                    />
                    <button className="newFriendFromButton">Submit</button>
                </form>
            </div>
        </>
    )
}