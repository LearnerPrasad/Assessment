import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Popup from './Popup';



export default function Profile(props) {
    const [countries, setCountries] = useState([]);
    const [toggle, setToggle] = useState('Pause');
    const [clock, setClock] = useState(0);
    const [selectedVal, setSelectedVal] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [intervalID, setIntervalID] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [postData, setPostData] = useState('')
    const nav = useNavigate();
    const { pid } = useParams();


    //GET API CALL FOR COUNTRIES
    const getCountries = () => {
        axios.get('http://worldtimeapi.org/api/timezone')
            .then((response) => {
                setCountries(response.data.map(name => { return { name, id: uuidv4() } }))
            })
            .catch((error) => {
                console.log(error.message)
            })
    }
    useEffect(() => {
        getCountries();
    }, [])

    //FUNCTION TO HANDLE API CALL ON SELECTING DROPDOWN
    const handleOptions = (id, name) => {
        const [area, location, region] = name.split('/');
        setSelectedVal((name.split('/').slice(-1)))
        axios.get(`http://worldtimeapi.org/api/timezone/${area}/${location}/${region ?? ''}`, {})
            .then((response) => {
                setClock(new Date(response.data.datetime.slice(0, -6)).getTime());
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    //FUNCTION TO HANDLE DISPLAYING POSTS
    const postsDisplay = (pid) => {
        return (
            <div className='d-flex flex-wrap justify-content-between'>
                {props.userPosts.filter(el => el.userId == pid).map(el => {
                    if (el.userId == pid) {
                        return (
                            <div className='card col-md-4 col-lg-4 col-sm-12 col-xs-12 border border-dark my-1 rounded-0'>
                                <div><b>Title</b> : {el.title}</div>
                                <div onClick={() => { setOpenPopup(true); setPostData(el) }}><b>Posts</b> :{el.body}</div>
                            </div>)
                    }
                })}
            </div>
        )
    }
    const handlebutton = () => {
        if (toggle === 'start') {
            setToggle('Pause')
        }
        else {
            setToggle('start');
        }
    }

    useEffect(() => {
        !props.userList.length && nav('/')
    }, [props])

    useEffect(() => {
        if (!isRunning && clock) {
            setIntervalID(setInterval(() => {
                setClock((prev) => prev + 1000)
            }, 1000))
            setIsRunning(true)
        }
        if (toggle === 'start') {
            clearInterval(intervalID)
            setIsRunning(false)
        }
    }, [toggle, clock])
    return (
        <>
            <div className=''>
                <Popup visible={openPopup} setVisible={setOpenPopup} postData={postData} />
                <div className='card d-flex flex-wrap'>
                    <div class="d-flex col-md-12 col-xl-12 col-lg-12 col-sm-3 col-xs-3 card-header align-items-center flex-wrap" style={{ backgroundColor: '#E87722' }}>
                        <div className='d-flex dropdown col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 justify-content-between'>
                            <div className='d-flex'>
                                <button className='btn btn-dark' onClick={() => { nav('/') }}>Back Home</button>
                            </div>
                            <div className='d-flex'>
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Country Dropdown
                                </button>
                                <ul class="dropdown-menu" style={{
                                    "height": 'auto',
                                    maxHeight: "200px",
                                    overflowX: "hidden"
                                }}>
                                    {
                                        countries.map(el => {
                                            return <li className="dropstart dropdown-item">
                                                <button className='dropdown-item' onClick={() => { handleOptions(el.id, el.name) }}>{el.name.split('/').slice(-1)}</button></li>
                                        })
                                    }
                                </ul>
                                <div>
                                    {selectedVal && <span>Time in {selectedVal} {clock ? new Date(clock).toLocaleTimeString() : ''}</span>}
                                </div>
                            </div>
                            <div className=' d-flex  justify-content-end'>
                                {
                                    selectedVal &&
                                    <button className={`btn btn-${toggle === 'Pause' ? "danger" : "success"}`} onClick={handlebutton}>
                                        {toggle}
                                    </button>
                                }
                            </div>
                        </div>
                        {/* <div className='col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3'>
                            {
                                selectedVal &&
                                <button className={`btn btn-${toggle === 'Pause' ? "danger" : "success"}`} onClick={handlebutton}>
                                    {toggle}
                                </button>
                            }
                        </div> */}
                    </div>
                    <div className='card-body'>
                        <div className='d-flex justify-content-center'><b>PROFILE DETAILS</b></div>

                        {
                            props?.userList.filter(user => user.id == pid).map(profile => {
                                return (
                                    <div>
                                        <div className='card'>
                                            <div className='d-flex flex-row justify-content-between'>
                                                <div><b>{profile.name}</b></div>
                                                <div>
                                                    {profile.address.city},
                                                    {profile.address.street},
                                                    {profile.address.suite},
                                                    {profile.address.zipcode},
                                                    <b>Geo</b>:{profile.address.geo.lat},{profile.address.geo.lng}
                                                </div>
                                            </div>
                                            <div className='d-flex flex-row justify-content-between'>
                                                <div>{profile.username} | {profile.company.catchPhrase}</div>
                                                <div>{profile.email} | {profile.phone}</div>
                                            </div>
                                            <div className='col-12 d-flex flex-wrap p-0'>
                                                {postsDisplay(pid)}
                                                <br />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div >
        </>
    )
}
