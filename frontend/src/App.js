import React, { useEffect } from 'react';
import { authActions } from './store/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

//components
import Signup from './components/Signup';
import Signin from './components/Signin';
import Home from './components/Home';
import Navbar from './components/Navbar';
import SingleQuestion from './components/SingleQuestion';
import Admin from './components/Admin';

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  // useEffect(() => {
  //   console.log(token, 'auth');
  //   dispatch(authActions.working({ h: 'hello', b: 'bye' }));
  // }, []);
  if (!isLoggedIn) {
    return (
      <div className='app'>
        <Toaster />
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='*' element={<Navigate to='/signup' />} />
        </Routes>
      </div>
    );
  } else {
    return (
      <div className='app'>
        <Toaster />
        <Navbar />
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/question/:id' element={<SingleQuestion />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </div>
    );
  }
}

export default App;
