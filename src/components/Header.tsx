import { faC, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GoogleSignInButton from './GoogleSignInButton'
import { MouseEventHandler, createRef, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'
import { signIn, useSession } from 'next-auth/react'
import { Oval } from "react-loader-spinner"
import { videoService } from '@/services/VideoService'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import SearchBar from './SearchBar'
import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
    expanded: boolean,
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
}

function Header({ expanded, setExpanded }: Props) {
    const { data, status } = useSession()
    const user = data?.customUser
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const videoFileRef = createRef<HTMLInputElement>()
    const thumbnailFileRef = createRef<HTMLInputElement>()
    const router = useRouter()

    useEffect(() => {
        if (user?.error) signIn()
    }, [data])
    return (
        <>
            <header
                onClick={() => setExpanded(false)}
                className="flex items-center py-5 justify-between">
                <div className="log flex items-center">
                    <div className='flex'>
                        {
                            user
                                ?
                                <img src={user?.avatar} className="rounded-full button avatar-button" />
                                :
                                status == "loading"
                                    ?
                                    <Oval color="#000" secondaryColor="#9ca3af" height={38} width={38} />
                                    :
                                    <GoogleSignInButton />
                        }
                        <button
                            onClick={() => router.push("/")}
                            className="search-button button ml-1 text-gray-400 py-2 border-gray-400 border-2 rounded-3xl button">
                            <FontAwesomeIcon icon={faC} />
                        </button>
                    </div>
                    {
                        user && open
                        &&
                        <Dialog
                            open={open}
                            onClose={() => {
                                if (videoFileRef.current) {
                                    videoFileRef.current.files = null
                                }
                                setOpen(false)
                            }}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                Upload Video
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    <span>Please fill up the following details before uploading</span>
                                    <form className="flex flex-col gap-3 py-3">
                                        <label>
                                            <p className="font-bold">Title</p>
                                            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full bg-gray-100 p-2 rounded-md" type="text" placeholder="eg: How to fight a bear?" />
                                        </label>
                                        <label>
                                            <p className="font-bold">Description</p>
                                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 description w-full bg-gray-100 p-2 rounded-md" placeholder="eg: In this video you'll see the techniques to..." />
                                        </label>
                                        <div>
                                            <p className="font-bold">Thumbnail (optional)</p>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    thumbnailFileRef.current!.click()
                                                }} className="mt-1 search-button text-gray-400 py-2">
                                                <FontAwesomeIcon icon={faUpload} />
                                            </button>
                                            <input
                                                style={{ display: "none" }}
                                                onChange={async (e) => {
                                                    setOpen(true)
                                                }} ref={thumbnailFileRef} type="file" className="w-0" />
                                        </div>
                                    </form>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={async () => {
                                    if (!title || !description) {
                                        console.log("These fields are not set")
                                        if (!title) toast.error("There is no title set")
                                        if (!description) toast.error("There is no description set")
                                        return
                                    }
                                    setOpen(false)
                                    const video = videoFileRef.current?.files![0]
                                    const thumbnail = thumbnailFileRef.current?.files![0]
                                    const videoConfig = {
                                        title, description
                                    }
                                    if (!video) return
                                    var data = new FormData()
                                    data.append('video', video)
                                    if (thumbnail) data.append('thumbnail', thumbnail)
                                    data.append('title', title)
                                    data.append('description', description)
                                    const json = await videoService.uploadVideo(data, user.access_token)
                                    if (json?.url) {
                                        toast.info("Video uploaded succesfully")
                                    }
                                }}>Yes</Button>
                                <Button onClick={() => {
                                    if (videoFileRef.current) {
                                        videoFileRef.current.value = ""
                                    }
                                    setOpen(false)
                                }} autoFocus>
                                    No
                                </Button>
                            </DialogActions>
                        </Dialog>
                    }
                </div>
                <div className="w-full flex justify-end gap-1">
                    <SearchBar />
                    {
                        user
                        &&
                        <form className="border-gray-400 border-2 rounded-3xl search-button">
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    videoFileRef.current!.click()
                                }} className="button text-gray-400 py-2">
                                <FontAwesomeIcon icon={faUpload} />
                            </button>
                            <input onChange={async (e) => {
                                setOpen(true)
                            }} ref={videoFileRef} type="file" className="w-0" />
                        </form>
                    }
                </div>
            </header >
            <ToastContainer
                position="bottom-center"
                autoClose={3000} // Set the time (in milliseconds) that the toast should be shown
                hideProgressBar={true}
                closeOnClick
                pauseOnHover={false}
                draggable
                pauseOnFocusLoss
            />
        </>
    )
}

export default Header