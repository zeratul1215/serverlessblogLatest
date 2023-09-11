import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultAvatar from "../../resources/avatar/avatar.jpg";
import config from "../../config/config";
import "../css/global.css";
import { Button, Modal} from "react-bootstrap";
import { Nav, NavItem } from "react-bootstrap"; 

const UserProfile = () => {

    //const avatarRef = useRef(null);
    const login = useSelector(state => state.login);
    const userAvatar = useSelector((state) => state.avatar);
    const username = useSelector((state) => state.username);
    const bio = useSelector((state)=>state.bio);
    const changeNameRef = useRef("");
    const changeBioRef = useRef("");
    const avatarInputRef = useRef(null);
    const [showchangeUsername,setShowChangeUserName] = useState(false);
    const [showchangeBio,setShowChangeBio] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [originalAvatar, setOriginalAvatar] = useState(userAvatar);
    const [originalUsername,setOriginalUsername] = useState(username);
    const [originalBio,setOriginalBio] = useState(bio);


    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const gradientStyle = {
        height: "100vh",
        display: "flex",
        padding: "20px",
        flexDirection:'column',
        background: "linear-gradient(to bottom, white, #FFEDCC)",
    };

    

    const logout = ()=>{
        alert("logout");
    }

    const editProfileFigure = () =>{
        const element = avatarInputRef.current;
        element.click();
    }


    const editUsername = () =>{
        setShowChangeUserName(true);
    }

    const editBio = () =>{
        setShowChangeBio(true);
    }

    const closeNameEdit = () => {
        setShowChangeUserName(false);
    }

    const closeBioEdit = () => {
        setShowChangeBio(false);
    }


    const handleShow = () => setShowDialog(true);
    const handleClose = () => setShowDialog(false);

    const submit = () => {
        console.log("submitted");
        handleClose();
    }


    return (
        <div variant="pills" style={gradientStyle}>
            <Nav>
                <NavItem>
                    <Nav.Link eventKey = "home" onClick={() => navigate("/home")}
                        style={{
                            border:"1px solid",
                            borderRadius:'5px'
                        }}
                    >
                        home
                    </Nav.Link>
                </NavItem>
            </Nav>
            <div className="container-fluid" 
                style={{
                    justifyContent:'center',
                    alignItems:'center'
                }}
            >
                <Modal show={showDialog} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to submit?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            No
                        </Button>
                        <Button variant="primary" onClick={submit}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
    
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
                        //ref = {avatarRef}
                        className="rounded-circle"
                        style={{
                            display:'flex',
                            width: "200px",
                            height: "200px",
                            backgroundImage: `url(${userAvatar})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            border:'solid grey 3px',
                            cursor: "pointer", // Add cursor pointer for the avatar
                        }}
                    >
                        <input
                            type="file"
                            style={{
                                display:"none"
                            }}
                            ref = {avatarInputRef}
                            onChange={e => {
                                const file = e.target.files[0];
                                dispatch({
                                    type:"LOGIN",
                                    payload:{
                                        avatar:URL.createObjectURL(file)
                                    }
                                })
                            }}
                        ></input>
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
                        flexDirection:"column",
                        alignItems:'center'
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
                                display:'inline-flex',
                                alignItems: 'center',
                                border:"solid 2px grey",
                                background:'white',
                                height:'40px',
                                width:"300px",
                                borderRadius:'8px',
                                padding:"10px"
                            }}
                        >&nbsp;&nbsp;&nbsp;username: {username}&nbsp;&nbsp;&nbsp;</div>
                        <div
                            className="rounded-circle"
                            style={{
                                marginLeft:"10px",
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
                            onClick={editUsername}
                        >
                            <div className="gg-pen"
                                style={{
                                    position:'relative',
                                    scale:'0.8',
                                    top:'13px',
                                    left:'12px'
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
                                        marginLeft:"10px",
                                        width:"90%",
                                        height:"40px",
                                        width:"200px",
                                        borderRadius:"8px"
                                    }}
                                    type="text"
                                    placeholder="Enter new user name"
                                    ref={changeNameRef}
                                />
                                <button className="btn btn-primary"
                                    style={{
                                        marginLeft:"10px",
                                        height:"40px"
                                    }}
                                >
                                    save
                                </button>
                                <button className="btn btn-primary"
                                    style={{
                                        marginLeft:"10px",
                                        height:"40px"
                                    }}
                                    onClick={closeNameEdit}
                                >
                                    cancel
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div 
                        style={{
                            display:'flex',
                            flexDirection:"row",
                            margin:"40px"
                        }}
                    >
                        <div
                            style={{
                                display:'inline-flex',
                                alignItems: 'center',
                                border:"solid 2px grey",
                                background:'white',
                                width:"300px",
                                borderRadius:'8px',
                                padding:"10px"
                            }}
                        >&nbsp;&nbsp;&nbsp;bio: {bio}&nbsp;&nbsp;&nbsp;</div>
                        <div
                            className="rounded-circle"
                            style={{
                                marginLeft:"10px",
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
                            onClick={editBio}
                        >
                            <div className="gg-pen"
                                style={{
                                    position:'relative',
                                    scale:'0.8',
                                    top:'13px',
                                    left:'12px'
                                }}
                            ></div>
                        </div>
                        {showchangeBio && (
                            <div
                                style={{
                                    display:'flex',
                                    flexDirection:"row",
                                    height:'30px'
                                }}
                            >
                                <textarea
                                    style={{
                                        marginLeft:"10px",
                                        height:"150px",
                                        borderRadius:"8px"
                                    }}
                                    type="text"
                                    placeholder="Enter new bio"
                                    ref={changeNameRef}
                                />
                                <button className="btn btn-primary"
                                    style={{
                                        marginLeft:"10px",
                                        height:"40px"
                                    }}
                                >
                                    save
                                </button>
                                <button className="btn btn-primary"
                                    style={{
                                        marginLeft:"10px",
                                        height:"40px"
                                    }}
                                    onClick={closeBioEdit}
                                >
                                    cancel
                                </button>
                            </div>
                        )}
                    </div>
    
                    <Button
                        onClick={handleShow}
                    >
                        submit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
