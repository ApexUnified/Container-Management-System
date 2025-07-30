import React, { useEffect, useState } from 'react'

export default function Toast({ flash }) {


    const [showSuccess, setShowSuccess] = useState(!!flash.success);
    const [showError, setShowError] = useState(!!flash.error);
    const [showInfo, setShowInfo] = useState(!!flash.info);

    useEffect(() => {
        if (flash.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 6000);
        }
        if (flash.error) {
            setShowError(true);
            setTimeout(() => setShowError(false), 6000);
        }


        if (flash.info) {
            setShowInfo(true);
            setTimeout(() => setShowInfo(false), 6000);
        }
    }, [flash]);

    return (
        <>

            <div className="fixed z-50 space-y-3 transform -translate-x-1/2 bottom-6 left-1/2">
                {/* Success Toast */}
                {showSuccess && (
                    <div
                        className="flex items-center max-w-xl p-4 text-green-800 transition-all duration-500 ease-out bg-green-400 rounded-lg shadow-sm animate-slide-up"
                        role="alert"
                    >
                        <div className="inline-flex items-center justify-center w-10 h-10 text-green-600 bg-white rounded-lg shrink-0 ">
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                        </div>
                        <div className="p-3 font-normal text-green-800 text-md">{flash.success}</div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="ms-auto -mx-1.5 -my-1.5  text-green-800  rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-green-300 inline-flex items-center justify-center h-8 w-8 "
                            aria-label="Close"
                        >
                            <svg
                                className="w-3 h-3"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Error Toast */}
                {showError && (
                    <div
                        className="flex items-center w-full max-w-xl p-4 transition-all duration-500 ease-out bg-red-500 rounded-lg shadow-sm text-white-500 animate-slide-up"
                        role="alert"
                    >
                        <div className="inline-flex items-center justify-center w-10 h-10 text-red-500 bg-red-100 rounded-lg shrink-0 ">
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                            </svg>
                        </div>
                        <div className="p-3 font-normal text-white text-md">{flash.error}</div>
                        <button
                            onClick={() => setShowError(false)}
                            className="ms-auto -mx-1.5 -my-1.5  text-white hover:text-white/50 rounded-lg focus:ring-2  inline-flex items-center justify-center h-8 w-8 "
                            aria-label="Close"
                        >
                            <svg
                                className="w-3 h-3"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                        </button>
                    </div>
                )}



                {/* Info Toast */}
                {showInfo && (
                    <div
                        className="flex items-center w-full max-w-xl p-4 text-white transition-all duration-500 ease-out bg-blue-500 rounded-lg shadow-sm animate-slide-up"
                        role="alert"
                    >
                        <div className="inline-flex items-center justify-center w-10 h-10 text-blue-500 bg-blue-100 rounded-lg shrink-0 ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>

                        </div>
                        <div className="p-3 font-normal text-md">{flash.info}</div>
                        <button
                            onClick={() => setShowInfo(false)}
                            className="ms-auto -mx-1.5 -my-1.5  text-white hover:text-white/50 rounded-lg focus:ring-2  inline-flex items-center justify-center h-8 w-8 "
                            aria-label="Close"
                        >
                            <svg
                                className="w-3 h-3"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
