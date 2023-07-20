import React, { useState, useEffect } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { authActions } from '../store/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import conf from '../config/config.json';

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('participant');

  const checkToken = async () => {
    try {
      if (localStorage.getItem('accessToken')) {
        const response = await axios.post(`${conf.baseurl}/verify-token`, {
          accessToken: localStorage.getItem('accessToken'),
        });

        if (response?.data?.status === 'success') {
          dispatch(authActions.authSuccess({ response: response.data }));
          navigate('/home');
        }
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${conf.baseurl}/signup`, {
        name,
        email,
        password,
        role,
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

  useEffect(() => {
    checkToken();
  }, []);
  return (
    <div className='app__signup'>
      <div className='signup__left'>
        <p>Already have an account?</p>
        <Link className='btn__link' to='/signin'>
          SignIn
        </Link>
      </div>
      <div className='signup__right'>
        <form
          onSubmit={(event) => signupHandler(event)}
          className='signup__form'
        >
          <h1>Signup</h1>
          <div className='form__content'>
            <div className='content__item'>
              <p>Name</p>
              <input
                type='text'
                name=''
                id='name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className='content__item'>
              <p>E-mail</p>
              <input
                type='text'
                name=''
                id='email'
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
                id='password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className='content__radio'>
              <p>Role</p>
              <input
                className='radio'
                type='radio'
                name='role'
                id='admin'
                value='admin'
                onClick={(e) => setRole(e.target.value)}
              />
              <label htmlFor='admin'>Admin</label>
              <input
                className='radio'
                type='radio'
                name='role'
                id='participant'
                value='participant'
                onClick={(e) => setRole(e.target.value)}
              />
              <label htmlFor='participant'>Participant</label>
            </div>
          </div>
          <button type='submit'>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
