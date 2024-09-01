import React from "react";



const CodeDisplay: React.FC<{ code: string | number }> = ({ code }) => {

    return (
        <pre className="text-white bg-gray-800 rounded p-4">
            TESTE:
            <code>{code}</code>
        </pre>
    );
}

export default CodeDisplay