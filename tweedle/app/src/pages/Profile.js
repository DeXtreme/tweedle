import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FaTrophy } from 'react-icons/fa';
import { Rank } from '../components/Rank';
import loader from './loader.svg';
import { useAPI } from '../API';

function Profile(){
    let goTo = useNavigate();
    let {getProfile} = useAPI();
    let {handle} = useParams();
    let [profile, setProfile] = useState(null);
    let [loading, setLoading] = useState(true); 

    useEffect(()=>{
        let mounted = true;
        getProfile(handle).then(profile=>{
            if(mounted){
                if(profile){
                    setProfile(profile);
                    setLoading(false);
                }else{
                    goTo("/404");
                }
            }
        })

        return () => mounted=false;
    },[])

    let orignal_match = profile?.picture.match(/(.*)_.*(\..*)$/i);
    let original =  orignal_match ? orignal_match[1]+orignal_match[2]: "";

    return(
        <div className="pt-24 px-6">
            {loading ? 
                <div className="flex justify-center pt-40">
                    <img src={loader} className="w-16 h-16" alt="loader" />
                </div>
            :
                <div>
                    <div className="mb-6">
                        <div className='flex flex-col items-center mb-6'>
                            <img className="w-28 h-28 rounded-xl ring-4 ring-light-blue" src={original} alt="dp" />
                            <p className='text-2xl mt-4'>{profile.handle}</p>
                            <div className='flex gap-2 text-2xl'>
                                {profile.trophies.map(_=><FaTrophy className='text-yellow-400'/>)}
                            </div>
                        </div>
                        
                    </div>
                    <div className='md:flex-1'>
                        <p className='font-medium mb-4'>Ranking</p>
                        {profile.ranks.map(ranking=><Rank ranking={ranking} highlight={ranking.handle === profile.handle} key={ranking.rank}/>)}
                    </div>
                </div>
            }
        </div>
    );
}

export default Profile;