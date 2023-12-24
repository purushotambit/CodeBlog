import logo from './logo.svg';
import React from "react";
import './App.css';
import axios from "axios";
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import UserRegister from './components/Register/Registation';
import UserLogin from './components/Login/Login';
import HomePage from './components/Homepage/HomePage';
import Comments from "./components/comments/Comments";
import CommentState from './context/comment/CommentState';
import UserState from './context/users/UserState';
import ReportState from './context/reports/ReportState';
import LikeState from './context/likes/LikeState';
import Page from './components/Page/Page';
function App() {
  return (
    <>
      <BrowserRouter>
      <UserState>
      <CommentState>
      <ReportState>
        <LikeState>
    <Navbar/>

      {/* <Comments /> */}
    <Routes>
    <Route  path="/" element={<HomePage/>}/>
    <Route path='page' element={<Page/>}/>
    <Route  path="/register" element={ <UserRegister/>}/>
    <Route path="/login" element={ <UserLogin/>}/>
    </Routes>
    </LikeState>
    </ReportState>
    </CommentState>
      </UserState>
    </BrowserRouter>
    </>
  );
}

export default App;
