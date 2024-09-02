import React from "react";
import { useGridContext } from '../contexts/GridContext';




const CodeDisplay: React.FC = () => {
    const { code, gridOccupied } = useGridContext();

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            {gridOccupied && <div className="flex flex-row gap-4 items-center text-2xl font-semibold ">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>LIVE
            </div>}
            <span className="flex flex-row justify-center items-center gap-2 text-black border border-black rounded p-4 w-44">
                YOUR CODE:
                <code>{code}</code>
            </span>
        </div>
    );
}

export default CodeDisplay