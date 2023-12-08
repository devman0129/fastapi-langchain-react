import React, { useState } from 'react';
import { Textarea, IconButton } from "@material-tailwind/react";
import { answerFunc } from '../actions/qaAction';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Input = ({answerFunc}) => {
  const [input, setInput] = useState("");
  const onChange = (e) => {
    setInput(e.target.value);
  }
  const onSubmit = (e) => {
    e.preventDefault();
    answerFunc({ input });
    setInput("");
  }
  const onKeyDown = (e) => {
    if(e.keyCode == 13) {
      if(e.ctrlKey) {
        setInput(input+"\n");
      }
      else{
        e.preventDefault();
        onSubmit(e);
      }
    }
  }
  return (
    <form onSubmit={onKeyDown}>
      <div className="flex items-center rounded-[99px] border border-blue-gray-500/80 bg-blue-500/10 ">
        <div>
          <IconButton variant="text" className="rounded-full" onClick={() => setInput("")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>
          </IconButton>
        </div>
        <Textarea
          rows={2}
          placeholder="Your Message"
          className="min-h-full !border-0 focus:border-transparent "
          containerProps={{
            className: "grid h-full !min-w-0",
          }}
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          name="input"
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <div>
          <IconButton variant="text" className="rounded-full" onClick={onSubmit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </IconButton>
        </div>
      </div>
    </form>
  );
}

Input.propTypes = {
  answerFunc: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { answerFunc })(Input);