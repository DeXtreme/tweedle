import { useState, useEffect } from "react";
import { FaRegCommentAlt, FaRegHeart, FaQuestionCircle} from "react-icons/fa";
import { AiOutlineRetweet } from 'react-icons/ai';

import { Choice } from '../Choice';
import { render } from "@testing-library/react";

export function QuestionType1({question, answer, onAnswer}){
    let [choice, setChoice] = useState(null);

    /*useEffect(()=>{
        setChoice(null)
    },[question])*/

    useEffect(()=>{
        if(choice){
            onAnswer(choice).catch(error=>{
                console.log(error);
                setChoice(null);
            });
        }
    },[choice])

    const handleSelect = (selection) => {
        setChoice(prev_choice => prev_choice ? prev_choice : selection)
    }



    return(
        <>
            <div className="flex flex-col items-center">
                <div className="md:-ml-16 max-w-3xl break-normal">
                    <p className="font-medium mb-3">Who tweeted this?</p>
                    <div className="flex gap-4">
                        <div>
                            <FaQuestionCircle className="text-5xl"/>
                        </div>
                        <div>
                            <p className="font-medium text-sm md:text-base">Tweedle<span className="inline-block ml-1 font-light">@tweedle</span></p>
                            <p className="md:text-lg">{question.pre.text}</p>
                            {(question.pre.media.length < 3) ?
                                <div className="flex rounded-2xl overflow-clip mt-2">
                                    {question.pre.media.map(media => <img className="w-1/2 h-80 flex-1 object-cover bg-accent" src={media.url} />)}
                                </div>
                            : (question.pre.media.length == 3) ?
                                <div className="flex rounded-2xl overflow-clip gap-1 mt-2">
                                    <img className="w-1/2 md:h-80 object-cover" src={question.pre.media[0].url} />
                                    <div className="flex flex-col w-1/2 gap-1">
                                        <img className="md:h-40 object-cover" src={question.pre.media[1].url} />
                                        <img className="md:h-40 object-cover" src={question.pre.media[2].url} />
                                    </div>
                                </div>
                            :
                                <div className="flex rounded-2xl overflow-clip mt-2 flex-wrap ">
                                    {question.pre.media.map(media => <img className="w-1/2 md:h-40 p-0.5 object-cover" src={media.url} />)}
                                </div>
                            }
                            <div className="flex flex-row justify-between items-center text-sm mt-6 mb-8">
                                <FaRegCommentAlt className="text-xl md:text-2xl opacity-70"/>
                                <AiOutlineRetweet className="text-2xl md:text-3xl opacity-70"/>
                                <FaRegHeart className="text-xl md:text-2xl opacity-70"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                {Object.keys(question.choices).map((name,i)=>
                    <Choice onClick={()=>handleSelect(name)} selected={name===choice}
                    hasSelection={!!choice} correct={answer && name===answer} wrong={answer && name!==answer}>
                        <img src={question.choices[name]} className="inline-block rounded-full
                        mr-4 w-9 h-9 bg-accent"/>
                        <span>@{name}</span>
                    </Choice>
                )}
            </div>
        </>
    );
}