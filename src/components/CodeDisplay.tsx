import React from "react";
import { useGridContext } from '../contexts/GridContext';




const CodeDisplay: React.FC = () => {
    const { code } = useGridContext();

    return (
        <div className="flex justify-center">
            <span className="flex flex-row justify-center items-center gap-2 text-black border border-black rounded p-4 w-44">
                YOUR CODE:
                <code>{code}</code>
            </span>
        </div>
    );
}

export default CodeDisplay