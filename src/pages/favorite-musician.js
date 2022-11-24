import React, { useEffect, useState } from "react";
import axios from "axios";

const FavoriteMusician = () => {

    const clientID = "4362f84c13c64a7ca35f98046d4ec695"
    const redirectURI = "http://localhost:3000"
    const authENDPOINT = "https://accounts.spotify.com/authorize"
    const responseTYPE = "token"

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }
        setToken(token)
    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const searchArtists = async (e) => {
        e.preventDefault()
        const { data } = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })
        setArtists(data.artists.items)
    }

    const renderArtists = () => {
        return artists.map(artist => (
            <div key={artists.id}>
                <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-center items-center py-5 rounded-full bg-gray-100 m-5">
                        {artist.images.length ? <img className="rounded-xl" width={"50%"} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
                        <span className="mt-3 font-bold text-xl">{artist.name}</span>
                    </div>
                </div>

            </div>
        ))
    }

    return (
        <>
            <div className="flex flex-col m-20 justify-center items-center">
                <h1 className="font-bold text-3xl">Spotify Artist Searcher</h1>
                <br />
                {!token ?
                    <button className="py-3 px-4 bg-black rounded-full text-white"><a href={`${authENDPOINT}?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=${responseTYPE}`}>Login to Spotify</a></button> : <button onClick={logout} className="py-3 px-4 bg-red-500 rounded-full text-white">Logout</button>}
                <br />

                {token ?
                    <form onSubmit={searchArtists}>
                        <input className="p-3 border-2 bg-slate-100 border-gray-800 rounded-xl" type="text" onChange={(e) => { setSearchKey(e.target.value) }} />
                        <button className="ml-4 py-3 px-4 bg-black rounded-lg text-white" type={"submit"}>Search</button>
                    </form>
                    : <h2 className="font-semibold">Please Login First!</h2>
                }

                {renderArtists()}
            </div>

        </>
    )
}
export default FavoriteMusician