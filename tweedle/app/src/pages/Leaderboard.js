import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAPI } from "../API";
import { FaTrophy } from 'react-icons/fa';
import { Rank } from "../components/Rank"

import loader from './loader.svg';

function Leaderboard(){
    let {ranks} = useSelector(state => state.leaderboard);
    let [isLoading, setLoading] = useState(true);
    let { getLeaderboard } = useAPI();

    useEffect(()=>{
        let mounted = true;
        setLoading(true);
        getLeaderboard().then(_=>{
            if(mounted){
                setLoading(false);
            }
        })

        return () => mounted = false;
    },[getLeaderboard])

    return(
        <div className="pt-24 px-6 flex-col">
            <h1 className="font-medium mb-4">Leaderboard</h1>
            {isLoading && ranks.length === 0 ?
                <div className="flex justify-center pt-40">
                    <img src={loader} className="w-16 h-16" alt="loader" />
                </div>
            :
                <>
                    {ranks.length > 0 ?
                        <div>   
                            {ranks.map((rank,i)=><Rank ranking={{rank:i+1,...rank}}/>)}
                        </div>
                    :
                        <div className="flex flex-col items-center pt-20">
                            <FaTrophy className="w-32 h-32 text-light-blue mb-2"/>
                            <h1 className="opacity-70 mb-8">No one's on here yet</h1>
                            <button className="bg-accent rounded-full px-8 py-3 font-medium
                            hover:text-light-blue hover:bg-white transition-all">
                                Play Now
                            </button>
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default Leaderboard;