import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/auth';
import toast from 'react-hot-toast';

//links
//add question and testcases, edit question, delete === Question
//list all questions
//submission

function Navbar() {
  const { role, email } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    localStorage.removeItem('accessToken');
    dispatch(authActions.logout());
    toast.success('Logged out successfully');
  };
  return (
    <div className='navbar'>
      <p>CodingLabs</p>
      <div className='nav__links'>
        <ul className='nav__items'>
          <li className='nav__item'>
            <Link to='/home' className='nav__link'>
              Home
            </Link>
          </li>

          {role == 'admin' && (
            <li className='nav__item'>
              <Link className='nav__link' to='/admin'>
                Admin
              </Link>{' '}
            </li>
          )}
          <li onClick={logoutHandler} className='nav__item'>
            <p className='nav__link'>
              <span className='logout'>Logout</span>({email})
            </p>
          </li>
          {/* <li className='nav__item'>
            <Link className='nav__link'>Question</Link>
          </li> */}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
