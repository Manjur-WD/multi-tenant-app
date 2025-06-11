import React from 'react'
import { GalleryVerticalEnd } from "lucide-react"

const Preloader = () => {
    return (
        <div className='preloader h-screen w-full flex justify-center items-center font-dmsans'>
            <div className="flex rounded-md bg-gray-200 p-3  animate-bounce">
                <GalleryVerticalEnd className="size-10 flex-shrink-0" />
                <p className="text-4xl font-black">MT</p>
            </div>
        </div>
    )
}

export default Preloader
