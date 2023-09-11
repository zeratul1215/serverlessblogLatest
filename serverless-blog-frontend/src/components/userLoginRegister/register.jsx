import React,{useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultAvatar from "../../resources/avatar/avatar.jpg";

import config from "../../config/config";
import Modal from "react-modal";

const Register = () =>{

    const gradientStyle = {
        height: "100vh",
        background: "linear-gradient(to bottom, white, #FFEDCC)",
    };

    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const emailRef = useRef("");
    const bioRef = useRef(null);
    const [isOpen,setIsOpen] = useState(false);
    const [avatar,setAvatar] = useState(null);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async() => {
        

        const register = new Promise((resolve,reject) => {
            let reqBody = {
                user:{
                    email:emailRef.current.value,
                    username:usernameRef.current.value,
                    password:passwordRef.current.value
                }
            }
    
            
            if(bioRef.current.value){
                reqBody.user.bio = bioRef.current.value;
            }

            if(!avatar){
                resolve(reqBody);
            }
            else{
                const reader = new FileReader();
    
                reqBody.user.avatar = {};

                reader.onload = function(){
                    reqBody.user.avatar.base64 = reader.result.split(",")[1];
                    reqBody.user.avatar.format = reader.result.split(",")[0];
                    resolve(reqBody);
                }
    
                reader.readAsDataURL(avatar);
            }
    
        }).then(data => {
            fetch(config.HOST_NAME+"/user/create",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // 设置请求头为 JSON 格式
                },
                body: JSON.stringify(data)
            }).then(response => {
                return response.json();
            }).then(data => {
                if(data.message != "create successful"){
                    throw new Error(data.message);
                }
                localStorage.setItem('blogToken',data.data.token);
                if(avatar){
                    dispatch({
                        type: "LOGIN",
                        payload:{
                            username:usernameRef.current.value,
                            email:emailRef.current.value,
                            password:passwordRef.current.value,
                            bio:bioRef.current.value,
                            avatar:URL.createObjectURL(avatar)
                        }
                    });
                }
                else{
                    dispatch({
                        type: "LOGIN",
                        payload:{
                            username:usernameRef.current.value,
                            email:emailRef.current.value,
                            password:passwordRef.current.value
                        }
                    });
                }
                setTimeout(() => {
                    navigate("/home");
                }, 3000);
                setIsOpen(true);
            }).catch(error => {
                alert(error);
            });
        });
        
    };

    return (
        // <div className={styles["register"]}>
        <div style={gradientStyle}>
        <div className="container mt-5"
            
        >
            <div className="row justify-content-center">
                <div className="col-md-6"
                    style={{
                        display:'flex',
                        justifyContent:'center',
                        alignItems:'center', minHeight: '80vh'
                    }}
                >
                <div className="card">
                    <div className="card-header">Register</div>
                    <div className="card-body">
                    <form>
                        <div className="form-group mb-4">
                            <label>Email</label>
                            <input
                                type="text"
                                className="form-control"
                                ref={emailRef}
                            />
                        </div>
                        <div className="form-group mb-4">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                ref={usernameRef}
                            />
                        </div>
                        <div className="form-group mb-4">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                ref={passwordRef}
                            />
                        </div>
                        <div className="form-group mb-4">
                            <label>Avatar</label>
                            <div 
                                className='square-box'
                                
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    border: '1px solid #ccc',
                                    display: 'flex',
                                    'justify-content': 'center',
                                    'align-items': 'center',
                                    overflow: 'hidden',
                                    'background-size': 'cover',
                                    'background-repeat': 'no-repeat',
                                    'background-position': 'center',
                                    backgroundImage: `url(${
                                      avatar ? URL.createObjectURL(avatar) : defaultAvatar
                                    })`,
                                  }}
                            ></div>
                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setAvatar(file);
                                }}
                            />
                        </div>
                        <div className="form-group mb-4">
                            <label>Bio</label>
                            <textarea 
                                className="form-control" 
                                aria-label="With textarea"
                                ref={bioRef}
                            ></textarea>
                        </div>
                        <div className="d-grid gap-2 mb-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleRegister}
                            >
                                Register
                            </button>
                        </div>
                        <Modal
                            isOpen={isOpen}
                            style={{
                                overlay: {
                                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                },
                                content: {
                                  width: '300px',
                                  height: '200px',
                                  margin: 'auto',
                                  display: 'flex',
                                  flexDirection: 'column', // 使用Flex布局
                                  justifyContent: 'center', // 在垂直方向上居中显示内容
                                  alignItems: 'center', // 在水平方向上居中显示内容
                                //   background: 'linear-gradient(to right, #ff8080, #66a3ff)', // 渐变背景色
                                },
                            }}
                        >
                            <h2 style={{ color: '#808080' }}>
                                register success
                            </h2>
                        </Modal>
                    </form>
                    </div>
                </div>
                </div>
            </div>
        </div></div>
    );
};

export default Register;