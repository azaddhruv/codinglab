import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SingleQuestion.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import conf from '../config/config.json';

function SingleQuestion() {
  const [compiling, setCompiling] = useState(false);
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState();
  const [compilers, setCompilers] = useState();
  const [compilerId, setCompilerId] = useState(1);
  const [source, setSource] = useState('');
  const { id } = useParams();
  const getQuestion = async () => {
    try {
      const response = await axios.get(`${conf.baseurl}/question/${id}`);
      const comp = await axios.get(`${conf.baseurl}/compilers`);

      setCompilers(comp.data.response.items);
      setQuestion(response.data.question);
      setIsLoading(false);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();
    try {
      setCompiling(true);

      const response = await axios.post(
        `${conf.baseurl}/question/submission`,
        {
          source,
          problemCode: question.code,
          compilerId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (response?.data?.result) {
        setResult(response.data.result);
      }
      setCompiling(false);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    getQuestion();
  }, []);
  if (isLoading) {
    return (
      <div className='single'>
        <h1>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className='single'>
        <div className='single__problem'>
          <h2>{question.code}</h2>
          <h3>{question.name}</h3>
          <p>{question.body}</p>
          <div className='problem__testcases'>
            <p>Testcases :</p>
            {question.testcases.map((testcase) => {
              return (
                <div key={testcase._id} className='testcase'>
                  <p>input : {testcase.input}</p>
                  <p>output: {testcase.output}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className='single__answer'>
          <p>Solution</p>
          <form onSubmit={formHandler} className='answer__form'>
            <textarea
              value={source}
              spellCheck='false'
              name=''
              id=''
              cols='30'
              rows='10'
              onChange={(e) => setSource(e.target.value)}
            ></textarea>
            <div className='form__wrapper'>
              <select
                onChange={(e) => {
                  setCompilerId(e.target.value);
                }}
                className='form__dropdown'
              >
                {compilers.map((compiler) => {
                  return (
                    <option value={compiler.id} key={compiler.id}>
                      {compiler.name}
                    </option>
                  );
                })}
              </select>
              <button>Submit</button>
            </div>
          </form>
          {compiling && <h1>Compiling...</h1>}
          {result && (
            <div className='result'>
              <h3>Result :</h3>
              <p>Status: {result.status}</p>
              <p>Score: {result.score}</p>
              <p>{result.runtime_info.cmperr}</p>
              <p>{result.runtime_info.psinfo}</p>
              {/* <p>{result.runtime_info.stderr}</p>
              <p>{result.runtime_info.stdout}</p> */}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SingleQuestion;
