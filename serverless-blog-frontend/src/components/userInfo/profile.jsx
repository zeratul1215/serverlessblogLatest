import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultAvatar from "../../resources/avatar/avatar.jpg";
import config from "../../config/config";
import "../css/global.css";
import { Button } from "bootstrap";

const UserProfile = () => {

    const avatarRef = useRef(null);
    const [username,setUserName] = useState("zeratul");
    const changeNameRef = useRef("");
    const [showchangeUsername,setShowChangeUserName] = useState(false);

    const gradientStyle = {
        height: "100vh",
        display: "flex",
        padding: "20px",
        flexDirection:'column',
        background: "linear-gradient(to bottom left, #f0f0f0, #333333)",
    };

    const logout = ()=>{
        alert("logout");
    }

    const editProfileFigure = () =>{
        alert("clicked");
    }

    const editUsername = () =>{
        setShowChangeUserName(true);
    }

    return (
        <div className="container-fluid"
        style={gradientStyle}
        >
            {/* Header */}
            <div className="container"
                style={{
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:"center"
                }}
            >
                {/* Avatar */}
                <div
                    ref = {avatarRef}
                    className="rounded-circle"
                    style={{
                        display:'flex',
                        width: "200px",
                        height: "200px",
                        backgroundImage: `url(${defaultAvatar})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        border:'solid grey 3px',
                        cursor: "pointer", // Add cursor pointer for the avatar
                    }}
                >
                    <div
                        className="rounded-circle"
                        style={{
                            position:'relative',
                            top:'140px',
                            left:'140px',
                            display:'flex',
                            width: "40px",                                
                            height: "40px",
                            backgroundSize: "cover",
                            background:'white',
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            border:'solid grey 3px',
                            cursor: "pointer",
                        }}
                        onClick={editProfileFigure}
                    >
                        <div className="gg-pen"
                            style={{
                                position:'relative',
                                top:'13px',
                                left:'12px'
                            }}
                        ></div>
                    </div>
                </div>
            </div>


            {/*content*/}
            <div
                className="container"
                style={{
                    display:'flex',
                    flexDirection:"column"
                }}
            >
                <div 
                    style={{
                        display:'flex',
                        flexDirection:"row",
                        margin:"40px"
                    }}
                >
                    <div
                        style={{
                            display:'inline-block',
                            border:"solid 2px grey",
                            background:'white',
                            height:'30px',
                            borderRadius:'8px'
                        }}
                    >&nbsp;&nbsp;&nbsp;username: {username}&nbsp;&nbsp;&nbsp;</div>
                    <div
                        className="rounded-circle"
                        style={{
                            display:'flex',
                            width: "30px",                                
                            height: "30px",
                            backgroundSize: "cover",
                            background:'white',
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            border:'solid grey 3px',
                            cursor: "pointer",
                        }}
                        onClick={editUsername}
                    >
                        <div className="gg-pen"
                            style={{
                                position:'relative',
                                scale:'0.8',
                                top:'8px',
                                left:'6px'
                            }}
                        ></div>
                    </div>
                    {showchangeUsername && (
                        <div
                            style={{
                                display:'flex',
                                flexDirection:"row",
                                height:'30px'
                            }}
                        >
                            <input
                                style={{
                                    width:"90%",
                                    height:"30px",
                                    width:"200px",
                                    borderRadius:"8px"
                                }}
                                type="text"
                                placeholder="Enter new user name"
                                ref={changeNameRef}
                            />
                            <button className="btn btn-primary"
                                style={{
                                    
                                }}
                            >
                                save
                            </button>
                            <button className="btn btn-primary">
                                cancel
                            </button>
                        </div>
                    )}
                </div>
                
            </div>


        </div>
    );
};

export default UserProfile;
