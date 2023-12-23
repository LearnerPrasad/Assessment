import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserList(props) {
    const nav = useNavigate();

    //Get API request for UserList With axios
    const getUserList = () => {
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then((response) => {
                console.log(response.data)
                props.setUserList(response.data)
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    //Get API request for userPosts With axios
    const getUserPost = () => {
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then((response) => {
                console.log(response.data)
                props.setUserPosts(response.data)
            })
            .catch((error) => {
                console.log(error.message)
            })
    }
    const postsCount = (id) => {
        const userPostsCount = props.userPosts.filter(posts => posts.userId === id);
        return userPostsCount.length
    }

    useEffect(() => {
        getUserList();
        getUserPost();
    }, [])
    const handleClick = (id) => {
        nav(`/profile/${id}`)
    }
    return (
        <div className='container'>
            <div className=''>
                <div className='d-flex justify-content-center'>
                    Directory
                </div>
                {props?.userList?.map(user => {
                    return (
                        <div className='card'>
                            <button onClick={() => handleClick(user.id)}> <div className='d-flex flex-row col-12 p-3'>
                                <div className='d-flex justify-content-start col-6'>
                                    {user.name}
                                </div>
                                <div className='d-flex justify-content-end col-6'>
                                    {postsCount(user.id)}
                                </div>
                            </div>
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
