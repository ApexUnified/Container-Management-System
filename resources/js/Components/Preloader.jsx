import React, { useEffect } from 'react'

export default function Preloader({ loaded, setLoaded }) {

    useEffect(() => {

        if (loaded) {
            const timeout = setTimeout(() => {
                setLoaded(false);
            }, 500);
            return () => clearTimeout(timeout);
        }

    }, []);

    return (

        <>
            {loaded && (
                <div
                    className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-white dark:bg-gray-900 z-[999999]"
                >
                    <div className="w-20 h-20 border-4 border-solid rounded-full animate-spin border-blue-500 border-t-transparent"></div>
                </div>


            )}
        </>
    )
}
