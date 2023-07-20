import React from 'react';
import './Question.css';
import img from '../assets/19362653.jpg';
import { Link } from 'react-router-dom';

function Question({ id, name, code, body }) {
  return (
    <div className='question'>
      <div className='question__heading'>
        <h2>{code}</h2>
        <h3>{name}</h3>
      </div>

      <button className='question__btn'>
        <Link className='question__text' to={`/question/${id}`}>
          Solve
        </Link>
      </button>
    </div>
  );
}

export default Question;
