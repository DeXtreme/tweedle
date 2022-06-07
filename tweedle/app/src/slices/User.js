import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from 'jwt-decode';


let initialState = {
    handle: null,
    picture: null,
    likes: false,
    likesCount: 0,
    token: null,
    refresh: null
}

const slice = createSlice({
    name: "user",
    initialState,
    reducers:{
        signIn(state, action){
            if(!state.token){
                let {access: token, refresh} = action.payload;
                let decoded = jwt_decode(token);
                let {handle,picture, likes} = decoded;
                return {...state, handle, picture,
                    likes, token, refresh};
            }
            return state;
        },
        signOut(state, action){
            return initialState;
        },
        like(state, action){
            let likes = action.payload.likes;
            if(likes !== null){
                return {...state, likes};
            }
            return state;
        },
        setLikeCount(state, action){
            let likesCount = action.payload.likesCount
            if(likesCount !==null){
                return {...state, likesCount};
            }
            return state;
        },
        updateToken(state, action){
            let token = action.payload.access
            return {...state, token}
        }
    },
})

export const actions = slice.actions;
export const reducer = slice.reducer;
