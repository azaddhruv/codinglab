import React, { useState, useEffect } from 'react';
import './Admin.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import conf from '../config/config.json';

function Admin() {
  const [isEdit, setIsEdit] = useState(false);
  const [questions, setQuestions] = useState();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [testCode, setTestCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const testSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const testcaseResponse = await axios.post(
        `${conf.baseurl}/question/testcase`,
        {
          code: testCode,
          input,
          output,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (testcaseResponse?.data?.status === 'success') {
        toast.success(testcaseResponse?.data?.message);
      } else {
        toast.error('Something went wrong');
      }
      setTestCode('');
      setInput('');
      setOutput('');
    } catch (err) {
      toast.error('Somehting Went Wrong');
    }
  };

  const questionSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      };

      let formBody = {
        code,
        name,
        body,
      };
      if (isEdit === false) {
        const response = await axios.post(
          `${conf.baseurl}/question`,
          formBody,
          config
        );

        if (response?.data?.status === 'success') {
          toast.success(response.data.message);
        } else {
          toast.error('Something Went Wrong');
        }
      } else {
        const response = await axios.put(
          `${conf.baseurl}/question`,
          formBody,
          config
        );

        if (response?.data?.status === 'success') {
          toast.success(response.data.message);
        } else {
          toast.error('Something Went Wrong');
        }
      }
      await getAdminQuestion();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const getAdminQuestion = async () => {
    try {
      const questionResponse = await axios.get(
        `${conf.baseurl}/question/admin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (questionResponse?.data?.questions)
        setQuestions(questionResponse.data.questions);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const fillEditForm = (ecode, ename, ebody) => {
    setIsEdit(true);
    setBody(ebody);
    setName(ename);
    setCode(ecode);
  };

  const deleteHandler = async (ecode) => {
    try {
      const delRes = await axios.delete(
        `${conf.baseurl}/question/${ecode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        },
        {
          code: ecode,
        }
      );
      if (delRes?.data?.status === 'success') {
        toast.success(delRes.data.message);
      } else {
        toast.error('Something Went Wrong');
      }
      await getAdminQuestion();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const typeHandler = () => {
    setIsEdit(!isEdit);
    if (isEdit === true) {
      setBody('');
      setCode('');
      setName('');
    }
  };

  useEffect(() => {
    getAdminQuestion();
  }, []);
  return (
    <div className='admin'>
      <div id='style-3' className='admin__questions'>
        <p>Your Questions</p>
        {questions &&
          questions.map((question) => {
            return (
              <div key={question._id} className='admin__question'>
                <p>{question.code} </p>
                <p>{question.name}</p>

                <button
                  className='edit__btn'
                  onClick={() =>
                    fillEditForm(question.code, question.name, question.body)
                  }
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteHandler(question.code)}
                  className='edit__btn'
                >
                  Delete
                </button>
              </div>
            );
          })}
      </div>
      <form
        id='style-3'
        onSubmit={questionSubmitHandler}
        className='admin__edit'
      >
        {isEdit ? <p>Edit Question</p> : <p>Add Question</p>}
        <div className='form__element'>
          <p>Code</p>
          <input
            value={code}
            type='text'
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div className='form__element'>
          <p>Name</p>
          <input
            value={name}
            type='text'
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='form__element'>
          <p>Body</p>
          <input
            value={body}
            type='text'
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <button type='submit'>Submit</button>
        <button type='button' onClick={typeHandler}>
          {!isEdit ? 'Update' : 'Post New'}
        </button>
      </form>
      <div id='style-3' className='admin__testcases'>
        <p>Add Testcase</p>
        <form onSubmit={testSubmitHandler} className='testcase__form'>
          <div className='testcase__element'>
            <p>Problem Code</p>
            <input
              value={testCode}
              onChange={(e) => setTestCode(e.target.value)}
              type='text'
            />
          </div>
          <div className='testcase__element'>
            <p>Input</p>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type='text'
            />
          </div>
          <div className='testcase__element'>
            <p>Output</p>
            <input
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              type='text'
            />
          </div>
          <button>Add Testcase</button>
        </form>
      </div>
    </div>
  );
}

export default Admin;
