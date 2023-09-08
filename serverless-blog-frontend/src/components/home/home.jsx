import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultAvatar from "../../resources/avatar/avatar.jpg";
import config from "../../config/config";
import "../css/global.css";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showWriteArticle, setShowWriteArticle] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [test,setTest] = useState(true);
  const [prevPageArticles,setPrevPageArticles] = useState(20);
  const userMenuRef = useRef(null);
  const avatarRef = useRef(null);
  const navigate = useNavigate();

  const gradientStyle = {
    height: "100vh",
    display: "flex",
    padding: "20px",
    flexDirection:'column',
    background: "linear-gradient(to bottom left, #f0f0f0, #333333)",
  };

  

  const loadMoreArticles = async () => {
    if(prevPageArticles != 20){
      alert("you have browsed all the articles");
      return;
    }
    
    await fetchArticles();
  }

  const fetchArticles = async () => {
    console.log(currentPage);
    setIsLoading(true);
    const response = await fetch(config.HOST_NAME+`/article/getLatestArticle/${currentPage}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' // 设置请求头为 JSON 格式
        }
    });
    setCurrentPage(currentPage + 1);
    const data = await response.json();
    setPrevPageArticles(data.data.length);
    if(currentPage == 1){
      await setArticles(data.data);
    }
    else{
      const temp = articles;
      for(let i = 0 ; i < data.data.length ; i++){
        temp.push(data.data[i]);
      }
      console.log(temp);
      await setArticles(temp);
    }
    setIsLoading(false);
  }

  const logout = ()=>{
    alert("logout");
  }

  // Simulate fetching articles from backend
  useEffect(() => {
    fetchArticles();
  }, []);

  const handleClickOutsideUserMenu = (e) => {
    if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
      setShowUserMenu(false);
    }
  };

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
          style={{
            display:'flex',
            flexGrow:2,
            width: "74px",
            height: "74px",
            backgroundImage: `url(${defaultAvatar})`,
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
              <div className="p-2 selectionTab" onClick={()=>logout()}>登出</div>
            </div>
          )}
        </div>

        
      </div>

      {/* Navigation Options */}
      <div className="d-flex justify-content-center my-4">
        <div
          className="btn-group"
          role="group"
          aria-label="Switch between Read and Write"
          style={{
            display:'flex'
          }}
        >
          <button
            type="button"
            className={`btn btn-secondary ${
              showWriteArticle ? "" : "active"
            }`}
            onClick={() => setShowWriteArticle(false)}
            style={{ width: "350px" }}
          >
            Read Articles
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${
              showWriteArticle ? "active" : ""
            }`}
            onClick={() => setShowWriteArticle(true)}
            style={{ width: "350px" }}
          >
            Write Article
          </button>
        </div>
      </div>

      {/* Article List or Write Article */}
      {showWriteArticle ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
          <h1>Hello World! This is the Write Article Page</h1>
        </div>
      ) : (
        
          <div
            style={{
              flexGrow: 1,
              overflowY: "scroll",
              maxWidth: "80%",
              alignItems:"center"
            }}
          >
                {articles.map((article) => (
                  <div
                    key={article.id}
                    style={{
                      background: "#ffffff",                            
                      borderRadius: "10px",
                      marginBottom: "20px",
                      padding: "10px",
                      marginLeft:'300px',
                      marginRight:'20px'
                    }}
                  >
                    {/* Article Title */}
                    <h3 className="browseTitle" style={{ marginTop: "0", marginBottom: "10px" }}
                      onClick={()=>navigate("/")}
                    >
                      {article.title}
                    </h3>

                    {/* Author Info */}
                    <div style={{ display: "flex", alignItems: "center" ,float:"r"}}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          marginRight: "10px",
                        }}
                      >
                      <img
                        src={article.authorAvatar || defaultAvatar}
                        alt="Author Avatar"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      </div>
                      <span>{article.authorName}</span>
                      </div>

                      {/* Article tags */}
                      <div style={{ marginTop: "10px" }}>
                      {article.tags.map((tag, index) => (
                        <div
                          key={index}
                          style={{
                            background: "#808080",
                            color: "#ffffff",
                            borderRadius: "20px",
                            padding: "5px 10px",
                            display: "inline-block",
                            margin: "5px",
                            fontSize: "14px",
                          }}
                        >
                          {tag}
                        </div>
                      ))}
                      </div>

                      {/* Article Description */}
                      <p style={{ marginTop: "10px" }}>{article.description}</p>
                    </div>
                  ))}
                </div>
          
        )}
        {showWriteArticle?(
          <></>
        ):(
          <div className="d-flex justify-content-center"
            style={{
              marginTop:'10px'
            }}
          >
            <button onClick={loadMoreArticles} className="btn btn-primary">
              Get More Articles
            </button>
          </div>
        )}
      </div>
    // </div>
  );
};

export default Home;
