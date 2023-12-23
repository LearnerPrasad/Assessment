import UserList from "./Components/UserList";
import Profile from "./Components/Profile";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";


function App() {
  const [userList, setUserList] = useState([]);
  const [userPosts, setUserPosts] = useState([]);


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserList userList={userList} setUserList={setUserList} userPosts={userPosts} setUserPosts={setUserPosts} />}/>
        <Route path='/profile/:pid' element={<Profile userList={userList} userPosts={userPosts} />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
