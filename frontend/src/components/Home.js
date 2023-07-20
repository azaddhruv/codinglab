import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import Question from './Question';
import conf from '../config/config.json';
import toast from 'react-hot-toast';

function Home() {
  const [isLoading, setIsLoading] = useState('true');
  const [question, setQuestion] = useState([]);
  const getAllQuestions = async () => {
    try {
      const response = await axios.get(`${conf.baseurl}/question`);
      setQuestion(response.data.question);
      setIsLoading(false);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    getAllQuestions();
  }, []);

  return (
    <div className='home'>
      <div className='home__img'></div>
      <div className='home__questions'>
        {!isLoading
          ? question.map((question) => {
              return (
                <Question
                  key={question._id}
                  id={question._id}
                  name={question.name}
                  code={question.code}
                  body={question.body}
                />
              );
            })
          : 'Loading'}
      </div>
    </div>
  );
}

export default Home;
