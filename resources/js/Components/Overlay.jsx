import React, { useState } from 'react'

export default function Overlay({ sidebarToggle, setSidebarToggle }) {
    return (
        <div
            onClick={() => setSidebarToggle(!sidebarToggle)}
            className={` ${sidebarToggle ? 'block lg:hidden' : 'hidden'} fixed w-full h-screen z-9 bg-gray-900/50`}
        ></div >

    );
}
