import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from "./Components/Landing.jsx";
import SignUp from './Components/SignUp.jsx';
import CreateProfile from './Components/CreateProfile.jsx'
import SignIn from './Components/SignIn.jsx'
import ProfilePage from './Components/Home.jsx'
import HomePage from './Components/HomePage.jsx'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* <Route path="/" element={<LandingHome />} /> */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/Signin" element={<SignIn />} />
          <Route path="/createprofile" element={<CreateProfile />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="/homepage" element={<HomePage />} />
        </Routes>
      </Router>
    </>
  )

}

export default App