import { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { FaTrophy, FaRegHeart, FaHeart } from 'react-icons/fa'; 
import { useAPI } from '../API';

import { QuestionType1 } from '../components/QuestionType1';


import loader from './loader.svg';
function Quiz(){

    let [quiz, setQuiz] = useState({})
    let [answer, setAnswer] = useState(null);
    let [isLoading, setLoading] = useState(false);
    let {newQuiz, answerQuiz} = useAPI();
    let location = useLocation();
    let goTo = useNavigate();

    useEffect(()=>{
        let mounted = true;
        setLoading(true);
        newQuiz().then(quiz =>{
            if(mounted){
                setQuiz(quiz);
                setLoading(false);
            }
        }).catch(error=>{
            console.log(error);
            goTo(-1);
        })
        return () => mounted=false;
    },[location])

    const handleAnswer = async (choice) => {
        let result = await answerQuiz(quiz.id, choice);
        let {answer,quiz:next} = result;
        setAnswer(answer);

        setTimeout(()=>{
            setAnswer(null);
            setQuiz(next);
        },2000);
    }   

    return(
        <div key={location.key} className='pt-24 px-6 flex flex-col'>
            {isLoading ? 
                <div className="flex flex-col items-center pt-40">
                    <img src={loader} className="w-16 h-16" alt="loader" />
                    <p className='mt-2 font-light'>Starting a new game...</p>
                </div>
            :
            (quiz && quiz.over !== true) ?
                <div>
                    <div className='flex items-center justify-end mb-4'>
                        <div className='text-4xl mr-6 font-light'>{quiz.points}</div>
                        <div className='flex gap-2'>
                            {Array(3).fill(0).map((_,i)=>(i<quiz.lives) ? <FaHeart /> : <FaRegHeart/>)}
                        </div>
                    </div>
                    {(quiz && quiz.question && quiz.question.type == 1) ?
                        <QuestionType1 onAnswer={handleAnswer} answer={answer} question={quiz.question}/>
                    :
                    <div></div>}
                </div>
            :
            <>
                <div className='flex flex-col items-center mt-20'>
                    <h1 className='text-5xl md:text-8xl font-light mb-8'>Game Over</h1>
                    <p className='text-lg mb-2'>Awesome. You scored</p>
                    <p className='text-6xl md:text-8xl font-light'>{quiz.points}</p>
                    <p className='mb-6'>points</p>
                    <FaTrophy className='text-6xl mb-10 opacity-40'/>
                    <Link to={"/quiz"} className="bg-accent rounded-full px-8 py-3 font-medium
                    hover:text-light-blue hover:bg-white transition-all">
                        Play Again
                    </Link>
                </div>
                <svg className="fixed right-0 -bottom-10 -z-10" width="625" height="717" viewBox="0 0 625 717" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M905.249 186.199L821.571 722.923C821.421 723.528 821.421 724.132 821.272 724.585C821.122 725.039 821.122 725.492 820.972 725.945C820.823 726.701 820.523 727.456 820.224 728.212C820.074 728.665 819.924 729.119 819.775 729.421C819.625 729.874 819.326 730.327 819.176 730.781C819.176 730.932 819.026 731.083 818.876 731.234C818.727 731.536 818.427 731.99 818.278 732.292C817.978 732.896 817.529 733.35 817.23 733.954C816.931 734.407 816.781 734.71 816.481 735.012C815.583 736.221 814.535 737.278 813.488 738.185C813.338 738.336 813.038 738.638 812.889 738.789C812.44 739.243 811.991 739.545 811.541 739.847C811.242 740.149 810.943 740.3 810.643 740.452C810.045 740.905 809.446 741.207 808.997 741.509C808.548 741.811 808.248 741.963 807.799 742.114C807.2 742.416 806.751 742.718 806.153 742.869C743.281 734.861 682.057 712.195 627.569 674.721C625.174 654.775 621.431 635.131 616.342 615.941C595.684 538.273 553.77 467.858 498.084 415.727C500.479 401.221 501.827 386.715 502.126 372.058C502.425 351.81 500.779 331.411 497.036 311.465C493.144 321.287 488.803 330.957 483.863 340.326C475.481 356.343 465.601 371.605 454.074 386.262C460.511 361.027 460.212 334.433 453.027 309.349C450.631 300.736 447.338 292.275 443.297 284.266C438.207 303.456 431.321 322.344 422.339 340.477C416.951 351.357 410.813 361.934 404.077 372.209C403.628 372.813 403.179 373.569 402.73 374.173C364.408 372.662 325.488 386.564 295.998 415.878C239.714 471.938 240.163 560.335 289.711 616.243C298.394 626.065 308.573 634.678 320.099 642.082C306.776 654.02 292.855 665.05 278.484 675.023C224.146 712.497 162.772 735.163 99.9005 743.171C99.3017 742.869 98.703 742.718 98.2539 742.416C97.8048 742.265 97.5054 741.963 97.0564 741.811C96.4576 741.509 95.8588 741.056 95.4097 740.754C95.1103 740.603 94.811 740.3 94.5116 740.149C94.0625 739.847 93.6134 739.394 93.1643 739.092C93.0146 738.94 92.7153 738.638 92.5656 738.487C91.5177 737.581 90.4699 736.372 89.5717 735.314C89.2723 735.012 88.9729 734.558 88.8232 734.256C88.3742 733.803 88.0748 733.198 87.7754 732.594C87.6257 732.292 87.3263 731.839 87.1766 731.536C87.0269 731.385 87.0269 731.234 86.8772 731.083C86.5778 730.63 86.4281 730.176 86.2784 729.723C86.1288 729.27 85.9791 728.968 85.8294 728.514C85.53 727.759 85.2306 727.003 85.0809 726.248C84.9312 725.794 84.7815 725.341 84.7815 724.888C84.6318 724.283 84.4821 723.83 84.4821 723.226L0.354605 186.199C-3.53742 161.72 25.503 146.005 43.6159 162.929L215.015 322.495C227.14 333.828 246.6 330.957 254.983 316.451L430.423 13.0328C440.452 -4.34426 465.301 -4.34426 475.181 13.0328L650.621 316.3C659.004 330.806 678.464 333.677 690.59 322.344L861.988 162.778C880.101 146.005 909.141 161.569 905.249 186.199Z" fill="#5FB2FE"/>
                </svg>
            </>
            }
            
        </div>
    )
}

export default Quiz;