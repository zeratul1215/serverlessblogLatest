import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import defaultAvatar from "../../resources/avatar/avatar.jpg";
import config from "../../config/config";
import "../css/global.css";

const Home = () => {
  const {slug} = useParams();
  const [title,setTitle] = useState(null);
  const [author,setAuthor] = useState(null);
  const [htmlContent,setHtmlContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const login = useSelector((state) => state.login);
  const userAvatar = useSelector((state) => state.avatar);
  const userMenuRef = useRef(null);
  const avatarRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const gradientStyle = {
    height: "100vh",
    display: "flex",
    padding: "20px",
    flexDirection:'column',
    background: "linear-gradient(to bottom, white, #FFEDCC)",
  };

  const autoLogin = async () => {
    console.log(userAvatar);
    if(login){
      return;
    }
    const token = localStorage.getItem('blogToken');
    if(token){
      console.log('token fetch success');//
      const response = await fetch(config.HOST_NAME + `/user/login`,{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      const avatarURL = data.data.avatar;
      try{
        await fetch(avatarURL).then((response) => {
          if(!response.ok){
            throw new Error('Network Error');
          }
          return response.blob();
        }).then(blob => {
          const imageURL = URL.createObjectURL(blob);
          return imageURL;
        }).then((imageURL)=>{
          dispatch({
            type:"LOGIN",
            payload:{
              username:data.data.username,
              email:data.data.email,
              avatar:imageURL,
              bio:data.data.bio
            }
          });
        });
        
      }
      catch(err){
        console.log(err);
      }
      //header: Authorization:Bearer +'token'
    }
    else{
      const avatarElement = document.getElementById("avatar");
      avatarElement.style.backgroundImage = `url(${defaultAvatar})`;
    }
  }

  const jumpLogin = () => {
    navigate("/login");
  }

  const logout = ()=>{
    localStorage.removeItem('blogToken');
    dispatch({
      type:"LOGOUT"
    });
    window.location.reload();
  }

  // Simulate fetching articles from backend
  useEffect(() => {
    autoLogin();
    getArticleContent();
  }, []);

  const handleClickOutsideUserMenu = (e) => {
    if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
      setShowUserMenu(false);
    }
  };

  const getArticleContent = async () => {
    console.log(slug);
    const response = await fetch(config.HOST_NAME + `/article/getArticleContent/${slug}`,{
      method:'GET',
      headers:{
        'Content-Type': 'application/json' // 设置请求头为 JSON 格式
      }
    });
    const data = await response.json();
    const authorResponse = await fetch(config.HOST_NAME + `/user/getUser`,{
      method:'GET',
      headers:{
        'Content-Type': 'application/json'
      },
      body:{
        user:{
          email:data.data.author
        }
      }
    });
    const userdata = await authorResponse.json();
    console.log(userdata);
    setTitle(data.data.title);
    setAuthor(data.data.author);
    const contentUrl = data.data.s3_URL;
    await fetch(contentUrl).then((response)=> {
      if(!response.ok){
        throw new Error('Network Error');
      }
      return response.text();
    }).then((data) => {
      setHtmlContent(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideUserMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUserMenu);
    };
  }, []);

  return (
    <div className="container-fluid"
      style={gradientStyle}
    >
      {/* Header */}
      <div className="container"
        style={{
          display:'flex',
          flexDirection:'row'
        }}
      >
        {/* Search Box */}
        <div className="d-flex flex-grow-1 mx-3 container"
          style={{
            display:'flex',
            flexGrow:8
          }}
        >
          <input
            style={{
              width:"90%",
              marginTop:'17px',
              height:"40px"
            }}
            type="text"
            placeholder="Enter the topic you are interested in"
          />
          <button className="btn btn-primary ms-2" 
            style={{
              height:"40px",
              marginTop:"17px",
              marginLeft:"20px"
            }}
          >Submit</button>
        </div>

        {/* Avatar */}
        <div
          ref = {avatarRef}
          className="rounded-circle"
          id = "avatar"
          style={{
            display:'flex',
            flexGrow:2,
            width: "74px",
            height: "74px",
            //backgroundImage: userAvatar == null ? `url(${defaultAvatar})`: userAvatar,
            backgroundImage: `url(${userAvatar})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            border:'solid grey 3px',
            cursor: "pointer", // Add cursor pointer for the avatar
          }}
          onClick={(event) => setShowUserMenu((prev) => !prev)}
        >
          {/* user menu */}
          {showUserMenu && (
            <div
              ref={userMenuRef}
              className="bg-light position-absolute shadow rounded"
              style={{
                top: avatarRef.current.offsetHeight + 25, // Set top position relative to the avatar's height
                minWidth: "150px",
                //animation: "slideDown 3s ease", // Add animation for the slide-in effect
              }}
              >
              <div className="p-2 selectionTab" onClick={()=>navigate("/user-profile")}>查看用户信息</div>
              <div className="p-2 selectionTab" onClick={()=>navigate("/change-password")}>修改密码</div>
              {
                login ? (
                  <div className="p-2 selectionTab" onClick={()=>logout()}>log out</div>
                ):(
                  <div className="p-2 selectionTab" onClick={()=>jumpLogin()}>log in</div>
                )
              }
              
            </div>
          )}
        </div>
      </div>
      <div>
        <h2>{title}</h2>
        <h4>{author}</h4>
        <div dangerouslySetInnerHTML={{__html:htmlContent}}></div>
      </div>
    </div>
  );
};

export default Home;
