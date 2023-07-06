import "./messenger.css"
import Topbar from "../../components/topbar/Topbar"
import Conversation from "../../components/conversations/Conversation"
import Message from "../../components/message/Message"
import ChatOnline from "../../components/chatOnline/ChatOnline"
import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import {io} from "socket.io-client"
import CryptoJS from "crypto-js";


export default function Messenger() {

    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const socket = useRef()
    const {user} = useContext(AuthContext);
    const scrollRef = useRef()

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, [])

    useEffect(() => {
        arrivalMessage && 
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev)=>[...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", users => {
            setOnlineUser(user.followings.filter((f) => users.some((u) => u.userId === f)));
        })
    }, [user])

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/"+user._id)
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + (currentChat ? currentChat._id : ""));
                const decryptedMessages = res.data.map(message => {
                    const bytes = CryptoJS.AES.decrypt(message.text, "secret_key");
                    const originalText = bytes.toString(CryptoJS.enc.Utf8);
                    message.text = originalText;
                    return message;
                });
                setMessages(decryptedMessages);

            } catch (err) {
                console.log(err);
            }
        }
        if (currentChat) {
            getMessages();
        }
    }, [currentChat])


    /*const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: CryptoJS.AES.encrypt(newMessage, "secret_key").toString(),
            conversationId: currentChat._id
        };

        const receiverId = currentChat.members.find(member=>member !== user._id);

        socket.current.emit("sendMessage",{
            senderId: user._id,
            receiverId,
            text: message.text,
        });

        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data])
            setNewMessage("")
        } catch (err) {
            console.log(err);
        }
    }*/


    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id
        };
    
        // Show message to user
        setMessages([...messages, message]);
        setNewMessage("");
    
        // Encrypt message and send to server
        const encryptedMessage = CryptoJS.AES.encrypt(newMessage, "secret_key").toString();
        const encryptedData = {
            sender: user._id,
            text: encryptedMessage,
            conversationId: currentChat._id
        };
    
        try {
            const res = await axios.post("/messages", encryptedData);
            const bytes = CryptoJS.AES.decrypt(res.data.text, "secret_key");
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            res.data.text = originalText;
            setMessages([...messages, res.data])
        } catch (err) {
            console.log(err);
        }
    
        const receiverId = currentChat.members.find(member=>member !== user._id);
    
        socket.current.emit("sendMessage",{
            senderId: user._id,
            receiverId,
            text: encryptedData.text,
        });
    }


    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])

    

    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInputs" />
                        {conversations.map((c) => (
                            <div onClick={() => {
                                setCurrentChat(c)
                            }}>   
                            <Conversation  conversation = {c} currentUser = {user}/>
                            </div>
                        ))}
                        
                    </div>
                    
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                        
                        <>
                        <div className="chatBoxTop">
                            {messages.map(m => (
                                <div ref={scrollRef}>
                                    <Message message={m} own={m.sender === user._id}/>
                                </div>
                            ))}
                            
                        </div>
                        <div className="chatBoxBottom">
                            <textarea className="chatMessageInput" autoFocus
                            placeholder="Write something..."
                            onChange={(e) =>setNewMessage(e.target.value)}
                            value={newMessage}
                            onKeyDown={(e) => {
                                if (e && e.keyCode === 13 && e.shiftKey === false && e.preventDefault) {
                                    e.preventDefault(e);
                                    handleSubmit(e);
                                }
                            }}
                            ></textarea>
                            <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                        </div> </> : <span className="noConversationText">Open a conversation to start chat.</span> }
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline 
                        onlineUsers={onlineUser} 
                        currentId={user._id} 
                        setCurrentChat={setCurrentChat}/>
                    </div>
                </div>
            </div>
        </>
    )
}
