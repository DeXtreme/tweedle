import classNames from 'classnames';
import {FaTrophy} from 'react-icons/fa'

export function Rank({ranking, highlight}){
    return(
        <> 
            <div className={classNames("flex items-center mb-2 flex-wrap p-3",
            "justify-between md:mb-4",{"bg-white text-light-blue rounded-xl":highlight})}>
                <h1 className='ml-2 w-full font-medium md:w-1/5'>{ranking.rank}.</h1>
                <div className='flex items-center md:flex-1'>
                    <img src={ranking.picture} className='rounded-full w-10 h-10 mr-4'/>
                    <p>{ranking.handle}</p>
                </div>
                <div className="flex flex-col 
                md:flex-row md:items-center md:flex-1 md:justify-around">
                    <p className='text-2xl text-right'>{ranking.points}</p>
                    <div className='flex text-lg'>
                        {ranking.trophies.map(_=> <FaTrophy className='text-yellow-400 ml-2'/>)}
                        {ranking.trophies.length ==0 && <FaTrophy className='opacity-60'/>}
                    </div>
                </div>
            </div>
        </>
    )
}