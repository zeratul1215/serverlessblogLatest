import React,{useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import config from "../../config/config";
import defaultAvatar from "../../resources/avatar/avatar.jpg";


const Login = () =>{

    const gradientStyle = {
        height: "100vh",
        background: "linear-gradient(to bottom, white, #FFEDCC)",
    };

    const Email = useRef();
    const Password = useRef();


    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleLogin = async () => {
        const reqBody = {
            user:{
                email:Email.current.value,
                password:Password.current.value
            }
        };
        const response = await fetch(config.HOST_NAME+'/user/login',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(reqBody)
        });
        const data = await response.json();
        console.log(data);
        localStorage.setItem('blogToken',data.data.token);

        let userAvatar = defaultAvatar;

        if(data.data.avatar){
            const avatarURL = data.data.avatar;
            await fetch(avatarURL).then((response) => {
                if(!response.ok){
                  throw new Error('Network Error');
                }
                console.log(response);
                return response.blob();
            }).then(blob => {
                const imageURL = URL.createObjectURL(blob);
                userAvatar = imageURL;
            });
        }

        dispatch({
            type: "LOGIN",
            payload:{
                username:data.data.username,
                email:Email.current.value,
                password:Password.current.value,
                bio:data.data.bio,
                avatar:userAvatar
            }
        });

        navigate('/home');
    };

    return (
        <div style = {gradientStyle}>
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6"
                    style={{
                        display:'flex',
                        justifyContent:'center',
                        alignItems:'center', minHeight: '80vh'
                    }}
                >
                
                <div className="card">
                    <div className="card-header">Login</div>
                    <div className="card-body">
                    <form>
                        <div className="form-group mb-4">
                        <label>Email</label>
                        <input
                            type="text"
                            className="form-control"
                            ref={Email}
                        />
                        </div>
                        <div className="form-group mb-4">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            ref={Password}
                        />
                        </div>
                        <div className="d-grid gap-2 mb-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        </div>
                        <div className="d-grid gap-2 mb-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    navigate("/Register");
                                }}
                            >
                                Don't have an account yet? Create one now!
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Login;