import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function Cards(props) {
    const [search, setSearch] = useState('');
    const [charactersProfiles, setCharactersProfiles] = useState([]);
    const [overAllData, setOverAllData] = useState([]);
    const [charactersData, setCharactersData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [genderValues, setGenderValues] = useState([]);
    const [speciesValues, setSpeciesValues] = useState([]);
    const [statusValues, setStatusValues] = useState([]);
    const [typeValues, setTypeValues] = useState([]);
    const [filterApplied, setFilterApplied] = useState(null);
    const [categories, setCategories] = useState(null);
    const [isloading, setIsLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);


    //const [searchedData, setSearchedData] = useState([]);
    const [locationsData, setLocationsData] = useState([]);
    const [episodesData, setEpisodesData] = useState([]);


    useEffect(() => {
        axios.get('https://rickandmortyapi.com/api', {

        })
            .then((response) => {
                console.log(response, "resrrsrr");
                setLoaded(true)
                setOverAllData([response.data]);
                setCharactersData([response.data.characters])
                // setLocationsData([response.data.locations])
                setEpisodesData(response.data.episodes)
            })
            .catch((error) => {
                console.log(error)
            })
    }, []);


    const getCharacterData = (url) => {
        axios.get(url, {})
            .then(
                (response) => {
                    console.log(response.data, "resp111");
                    setPageCount(response.data.info.pages)
                    setLoaded(false)
                    setCharactersProfiles(response?.data?.results);
                    setCategories(() => {
                        let cats = { gender: [], species: [], status: [], type: [] };
                        response.data.results.forEach(element => {
                            cats.gender = [...new Set([...cats.gender, element.gender])]
                            cats.species = [...new Set([...cats.species, element.species])]
                            cats.type = [...new Set([...cats.type, element.type])]
                            cats.status = [...new Set([...cats.status, element.status])]
                        })
                        return cats;
                    });
                })
            .catch(
                (error) => {
                    console.log(error)
                })
            .finally(() => {
                setIsLoading(false)
            })
    }


    useEffect(() => {
        if (loaded) {
            getCharacterData(charactersData + "?page=1");
        }
    }, [loaded])

    const getData = () => {
        let tempData = [];
        if (filterApplied) {
            tempData = charactersProfiles.filter(i => i[filterApplied.filterBy] === filterApplied.value)
            if (search) {
                return tempData?.filter(i => i?.name?.toLowerCase().includes(search?.toLowerCase()))
            }
            return tempData
        }
        return charactersProfiles?.filter(i => i?.name?.toLowerCase().includes(search?.toLowerCase()))

    }
    return (
        <div className='card p-2 bg-warning text-dark'>
            <div className='d-flex justify-content-end flex-direction-reverse m-2'>
                <form className="d-flex">
                    <input className="form-control me-2" type="search" onChange={(e) => { setSearch(e.target.value) }} placeholder="Search" aria-label="Search" />
                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Filter
                        </button>

                        <ul className="dropdown-menu">
                            {Object.keys(categories ?? {}).map(cat => {
                                return <li className='dropstart'>
                                    <button className="dropdown-item dropdown-toggle" data-bs-toggle="dropdown"  onClick={(e) => { e.stopPropagation() }}>{cat.toUpperCase()}</button>
                                    <ul className='dropdown-menu'>
                                        {categories[cat].map(i => {
                                            return <li onClick={(e) => { setFilterApplied({ filterBy: cat, value: i });e.preventDefault() }}>
                                                <button className="dropdown-item">{i}</button>
                                            </li>
                                        }
                                        )}
                                    </ul>
                                </li>
                            })}
                        </ul>
                    </div>
                    <div className='w-100'>
                        {filterApplied && <button className='btn btn-danger' onClick={() => { setFilterApplied(null) }}>Clear Filter</button>}
                    </div>
                </form>
            </div>
            <div className='d-flex flex-wrap justify-content-center' style={{ minHeight: "100Vh" }}>
                {isloading ? <div>Loading........</div> :
                    <>
                        {filterApplied && <div>Filtered By {filterApplied.filterBy}:{filterApplied.value}</div>}
                        <div className='d-flex flex-wrap justify-content-center'>

                            {
                                getData()?.length ?
                                    getData()?.map((profile) => {
                                        return (
                                            <div key={profile.id} className="card" style={{ width: "18rem" }}>
                                                <img src={profile.image} className="card-img-top" alt="OOPS not loaded!!!!!!" />
                                                <div className="card-body">
                                                    <Link to={`/characters/${profile.id}`}>
                                                        <h2 className="card-title">{profile?.name}</h2>
                                                    </Link>
                                                    <div className='d-flex'>
                                                        <div className="card-title">{profile?.status} - </div>
                                                        <div className="card-title">{profile?.species}</div>
                                                    </div>
                                                    <div><b>Last known location:</b>{profile.location.name}</div>
                                                    <p className="card-text"><b>Gender:</b>{profile?.gender}</p>
                                                    <p className="card-text"><b>Type:</b>{profile?.type || " - "}</p>
                                                    <Link to={`/characters/${profile.id}`}> <button className="btn btn-primary">View Character</button></Link>
                                                </div>
                                            </div>
                                        )
                                    }) : <div>OOPS not Found!!!!!!!!!!!</div>
                            }
                        </div>
                        <Stack spacing={2}>
                            <Pagination count={pageCount} shape="rounded" onChange={(e, page) => {
                                getCharacterData(charactersData + "?page=" + page);
                            }} />
                        </Stack>
                    </>}
            </div>

        </div>
    )
}
