import defaultAvatar from "../../resources/avatar/avatar.jpg";

const initialState = {
    login:false,
    username:"",
    email:"",
    bio:"",
    avatar: defaultAvatar
}

export function rootReducer(state = initialState,action){
    switch(action.type){
        case "LOGIN":
            return {
                ...state,
                login:true,
                username:action.payload.username,
                email:action.payload.email,
                bio:action.payload.bio,
                avatar:action.payload.avatar?action.payload.avatar:defaultAvatar
            };
        case "LOGOUT":
            return {
                ...state,
                login:false,
                username:"",
                email:"",
                bio:"",
                avatar:defaultAvatar
            };
        default:
            return state;
    }
}