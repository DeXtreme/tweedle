import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { TwitterAuthProvider, getAuth, signInWithPopup } from '@firebase/auth';
import { userActions, boardActions } from '../slices';
import { context } from './context';
import { Alert } from './Alert';
import { app } from './firebase';


export function Provider({children}){

    let dispatch = useDispatch();
    let [alerts, setAlerts] = useState({});
    let goTo = useNavigate();
    let {token, likes, handle} = useSelector(state => state.user);


    const addAlert = (message) => {
        setAlerts(alerts => {
            alerts[message] = message;
            return {...alerts};
        })
    }

    const signIn = () => {
        const authProvider = new TwitterAuthProvider();
        const auth = getAuth(app);
        signInWithPopup(auth, authProvider).then(result => {
            return result.user.getIdToken();
        }).then(token=>{
            async function handleResponse(response){
                if(response.ok){
                    let json = await response.json();
                    let {access, refresh} = json;
                    dispatch(userActions.signIn({access, refresh}));
                }
            }

            return post('account/token/', {token: token}, handleResponse);
        }).catch(error=>{
            console.log(error);
            addAlert("Error signing in");
        })
    }

    const signOut = () => {
        dispatch(userActions.signOut());
        goTo("/");
    };

    const like = () => {
        if(!handle){
            addAlert("Please sign in first")
            return;
        }

        async function handleResponse(response){
            if(response.ok){
                let likes = (await response.json()).likes;
                dispatch(userActions.like({likes}));
                getLikeCount();
            }
        }

        patch(`account/${handle}/like/`, {like: !likes},
            handleResponse).catch(error => {
            console.log(error);
        })
    }

    const getLikeCount = () => {
        async function handleResponse(response){
            if(response.ok){
                let likesCount = (await response.json())["likes_count"];
                dispatch(userActions.setLikeCount({likesCount}));
            }
        }

        get("account/likes/", handleResponse).catch(error => {
            console.log(error);
        })
    }

    const getLeaderboard = async () =>{
        async function handleResponse(response){
            if(response.ok){
                let json = await response.json();
                dispatch(boardActions.setRanks({ranks:json}))
            }
        }
        
        await get("account/", handleResponse).catch(error=>{
            console.log(error);
        })
    }

    const getProfile = async (handle) => {
        async function handleResponse(response){
            if(response.ok){
                return await response.json();
            }
            return null;
        }

        let profile = await get(`account/${handle}`, handleResponse)
            .catch(error=>{
                console.log(error);
            });
        
        return profile;
    }

    const newQuiz = async () => {

        if(!handle){
            addAlert("Please sign in first")
            throw new Error();
        }

        async function handleResponse(response){
            if(response.ok){
                return await response.json();
            }
            throw new Error();
        }

        let quiz = await get(`quiz/`, handleResponse)

        return quiz;
    }

    const answerQuiz = async (quiz_id,choice) => {
        async function handleResponse(response){
            if(response.ok){
                return await response.json();
            }
            throw new Error();
        }
        
        let quiz = await post(`quiz/${quiz_id}`,{choice}, handleResponse)
            .catch(error=>{
                console.log(error);
            });

        return quiz;
    }

    const api = () => {
        return {get, post, patch}
    }

    const get = async (url,callback) => {
        let response = await fetch(`${process.env.REACT_APP_API_URL}/v1/${url}`,
            {
                method:"get",
                headers:{
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                }
            })
            .catch(error=>{
                console.log(error)
                addAlert("Please check your internet connection");
            });
        if(response.status === 500){
            addAlert("A server error was encountered");
        }else if(response.status === 401){
            addAlert("Please sign in");
            goTo("/", {replace:true})
        }

        return (callback) ? await callback(response): response;
    }

    const post = async (url,body,callback) => {
        let response = await fetch(`${process.env.REACT_APP_API_URL}/v1/${url}`,
            {
                method:"post",
                headers:{
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                },
                body:JSON.stringify(body)
            }).catch(error=>{
                console.log(error);
                addAlert("Please check your internet connection");
            });

        if(response.status === 500){
            addAlert("A server error was encountered");
        }else if(response.status === 401){
            addAlert("Please sign in");
        }

        return (callback) ? await callback(response): response;
    }

    const patch = async (url,body,callback) => {
        let response = await fetch(`${process.env.REACT_APP_API_URL}/v1/${url}`,
            {
                method:"PATCH",
                headers:{
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                },
                body:JSON.stringify(body)
            }).catch(error=>{
                console.log(error)
                addAlert("Please check your internet connection");
            });

        if(response.status === 500){
            addAlert("A server error was encountered");
        }else if(response.status === 401){
            addAlert("Please sign in");
        }

        return (callback) ? await callback(response): response;
    }

    
    const onAlertClose = (key) => {
        setAlerts(alerts => {
            delete alerts[key];
            return {...alerts};
        })
    }

    return(
        <context.Provider value = {{signIn,signOut,like,getLikeCount,
        getLeaderboard, getProfile, newQuiz, answerQuiz,api}}>
            <div className='absolute top-20 right-0 z-10
            mr-2 w-full flex flex-col items-end overflow-x-hidden'>
                {alerts && Object.keys(alerts).map( key =>
                    <Alert key={key} 
                    message={alerts[key]}
                    onClose={()=>onAlertClose(key)}/>
                )}
            </div>
            {children}
        </context.Provider>
    )
}

