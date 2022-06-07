import { configureStore } from '@reduxjs/toolkit';
import { userReducer, boardReducer } from './slices';

const store = configureStore({
    reducer:{
        "user": userReducer,
        "leaderboard": boardReducer,
    }
});

export default store;
