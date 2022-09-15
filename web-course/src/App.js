import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';
import React from "react";
import Logo from "./Assets/Spotify.png";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';



function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            How does the page work?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This app is using https://developer.spotify.com/ API. <br></br>
            <br></br>
            <b>Steps:</b><br></br>
            1. Press 'Login to Spotify' and insert the details.<br></br>
            2. Search for an artist.<br></br>
            3. You will now see every artist and their profile picture related to the name you searched.<br></br>
            4. Press logout when you want to stop using the app.

          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

function App() {
    const ClientId = "5fa28d1d9fe542a6aea8ff74ab17324e"
    var redirect_uri = "http://localhost:3000"
    const Authorize = "https://accounts.spotify.com/authorize"
    const ResponseType = "token"

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])



    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(element => element.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }
        setToken(token)
    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const searchArtists = async (artist) => {
        artist.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
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
            <div key={artist.id}>
                <h2 class="h2">{artist.name}</h2>
                {artist.images.length ? <img width={"800px"} src={artist.images[0].url} alt=""/> : <div>Photo not available</div>}
            </div>
        ))
    }
    const [modalShow, setModalShow] = React.useState(false);


    return (
        <div className="App">
            <header className="App-header">
                <img src={Logo} width="700" alt="logo"></img>
                <h1>API</h1>
                {!token ?
                    <a href={`${Authorize}?client_id=${ClientId}&redirect_uri=${redirect_uri}&response_type=${ResponseType}`}>Login
                        to Spotify</a>
                    : <button class="button button2" onClick={logout}>Logout</button>}
                {token ?
                    <form onSubmit={searchArtists}>
                        <input type="text" placeholder="Search" onChange={e => setSearchKey(e.target.value)}/>
                        <button class="button button2" type={"submit"}>Search</button>
                    </form>

                    : <div>
                    </div>
                }
                {renderArtists()}
                <div>
                    <button class="button button2" onClick={() => setModalShow(true)}>How does the page work?</button>
                    <MyVerticallyCenteredModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}/>
                </div>
            </header>
        </div>     
    );
    
}


export default App;
