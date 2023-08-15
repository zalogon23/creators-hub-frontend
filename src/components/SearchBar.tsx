import { feedContext } from '@/contexts/FeedContext'
import { Helper } from '@/lib/helper'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'

type Props = {}

function SearchBar({ }: Props) {
    const { search: searchAction } = useContext(feedContext)
    const [expanded, setExpanded] = useState(false)
    const [search, setSearch] = useState("")
    const handleSearch = () => {
        if (!expanded) setExpanded(true)
        if (search == "") return
        setExpanded(false)
        searchAction(search)
        setSearch("")
    }
    useEffect(() => {
        document.addEventListener("click", e => {
            setExpanded(false)
        })
    })
    return (
        <form
            onClick={e => e.stopPropagation()}
            className={`search-container${expanded ? ' expanded' : ''} border-gray-400 border-2 rounded-3xl overflow-hidden`}
            onSubmit={Helper.prevent}>
            <input
                onClick={e => e.stopPropagation()}
                value={search} onChange={e => setSearch(e.target.value)} className={`search-input${expanded ? ' expanded' : ''} py-2 rounded-l-3xl pl-3 pr-1 search border-y-0 border-l-0 border-r-gray-400 border-2`} type="text" placeholder="What are you looking for?" />
            <button
                onClick={handleSearch} className="search-button text-gray-400 py-2">
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </form>
    )
}

export default SearchBar