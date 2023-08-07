import { faSearch, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Helper } from "../lib/helper"
import GoogleSignInButton from './GoogleSignInButton'
import { MouseEventHandler, createRef, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import { Oval } from "react-loader-spinner"
import { videoService } from '@/services/VideoService'

type Props = {
    expanded: boolean,
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
    loading: boolean
}

function Header({ loading, expanded, setExpanded }: Props) {
    const { data } = useSession()
    const user = data?.customUser
    const [search, setSearch] = useState("")
    const inputFileRef = createRef<HTMLInputElement>()

    const handleSearch: MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.stopPropagation()
        try {
            if (!expanded) {
                setExpanded(true)
                return
            }
        } catch (err) {
            toast.dismiss()
        }
    }
    return (
        <>
            <header
                onClick={() => setExpanded(false)}
                className="flex items-center py-5 justify-between">
                <div className="log flex items-center">
                    {
                        user
                            ?
                            <img src={user?.avatar} className="w-10 h-10 mr-2 rounded-full" />
                            :
                            data === null
                                ?
                                <GoogleSignInButton />
                                :
                                <Oval color="#000" secondaryColor="#9ca3af" height={38} width={38} />
                    }
                </div>
                <div className="w-full flex justify-end gap-1">
                    <form
                        className={`search-container${expanded ? ' expanded' : ''} border-gray-400 border-2 rounded-3xl overflow-hidden`}
                        onSubmit={Helper.prevent}>
                        <input
                            onClick={e => e.stopPropagation()}
                            value={search} onChange={e => setSearch(e.target.value)} className={`search-input${expanded ? ' expanded' : ''} py-2 rounded-l-3xl pl-3 pr-1 search border-y-0 border-l-0 border-r-gray-400 border-2`} type="text" placeholder="What are you looking for?" />
                        <button
                            disabled={loading}
                            onClick={handleSearch} className="search-button text-gray-400 py-2">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                    {
                        user
                        &&
                        <form className="border-gray-400 border-2 rounded-3xl search-button">
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    inputFileRef.current!.click()
                                }} className="search-button text-gray-400 py-2">
                                <FontAwesomeIcon icon={faUpload} />
                            </button>
                            <input onChange={async (e) => {
                                const video = e.target.files![0]
                                var data = new FormData()
                                data.append('video', video)
                                const json = await videoService.uploadVideo(data)
                                if (json?.url) {
                                    toast.info("Video uploaded succesfully")
                                }
                            }} ref={inputFileRef} type="file" className="w-0" />
                        </form>
                    }
                </div>
            </header >
            <ToastContainer
                position="bottom-center"
                autoClose={4400} // Set the time (in milliseconds) that the toast should be shown
                hideProgressBar={true}
                closeOnClick
                pauseOnHover
                draggable
                pauseOnFocusLoss
            />
        </>
    )
}

export default Header