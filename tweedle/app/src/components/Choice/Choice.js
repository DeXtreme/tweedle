import classNames from "classnames";

export function Choice({children, onClick, selected, correct, wrong, hasSelection}){
    return(
        <div onClick={onClick} 
        className={classNames("bg-[#5FB2FE] text-center","py-3 rounded-full mb-3",
        "transition-all cursor-pointer","w-full md:max-w-xl",
        {"hover:bg-white hover:text-light-blue": !hasSelection},
        {"bg-white text-light-blue":(selected && !correct && !wrong)},
        {"bg-green-500 text-white":(correct)},
        {"bg-red-500 text-white":(selected && wrong)})}>
            {children}
        </div>
    );
}