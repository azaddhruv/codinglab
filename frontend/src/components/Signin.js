import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import conf from '../config/config.json';

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signinHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${conf.baseurl}/login`, {
        email,
        password,
      });
      if (response.data.status === 'success') {
        localStorage.setItem('accessToken', `${response.data.accessToken}`);
        dispatch(authActions.authSuccess({ response: response.data }));
        navigate('/home');
        toast.success('Successfully signed in');
      } else {
        if (response?.data?.message)
          return toast.error(response?.data?.message);
        toast.error('Something Went Wrong');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='app__signup'>
      <div className='signup__left'>
        <p>Not Registered?</p>
        <Link className='btn__link' to='/signup'>
          SignUp
        </Link>
      </div>
      <div className='signup__right'>
        <form onSubmit={signinHandler} className='signup__form'>
          <h1>Sign In</h1>
          <div className='form__content'>
            <div className='content__item'>
              <p>E-mail</p>
              <input
                type='text'
                name=''
                id=''
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className='content__item'>
              <p>Password</p>
              <input
                type='password'
                name=''
                id=''
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
          <button type='submit'>Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
