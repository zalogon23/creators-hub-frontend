import { faCoins, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Helper } from "../lib/helper"
import GoogleSignInButton from './GoogleSignInButton'
import { MouseEventHandler, useContext, useRef, useState } from 'react'
import { userContext } from '../contexts/UserContext'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'

type Props = {
    expanded: boolean,
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
    loading: boolean
}

function Header({ loading, expanded, setExpanded }: Props) {
    const user = useContext(userContext)
    const [search, setSearch] = useState("")

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
                            <img src={user.avatar} className="w-10 h-10 mr-2 rounded-full" />
                            :
                            <GoogleSignInButton />
                    }
                </div>
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
            </header >
            <ToastContainer
                position="top-center"
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