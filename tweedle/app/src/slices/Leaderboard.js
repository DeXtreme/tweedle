import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    ranks: []
}

const slice = createSlice({
    name:"leaderboard",
    initialState,
    reducers: {
        setRanks(state, action){
            let ranks = action.payload.ranks
            if(ranks){
                return {ranks:[...ranks]};
            }
            return state
        },
        addRanks(state, action){
            let ranks = action.payload
            if(ranks){
                return {ranks:[...state.ranks,...ranks]};
            }
            return state
        }
    }
})

export const actions = slice.actions;
export const reducer = slice.reducer;
