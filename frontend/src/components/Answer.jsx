import React, { useState, useEffect } from 'react';
import bot from "./img/bot.jpg";

const Answer = (props) => {
  const [text, setText] = useState('');
  useEffect(() => {
    const textToType = "  "+props.value;
    let index = 0;
    
    const timer = setInterval(() => {
      setText((prevText) => prevText + textToType.charAt(index));
      index++;
      
      if (index === textToType.length) {
        clearInterval(timer);
      }
    }, 10); // Adjust the typing speed by modifying the delay here
    
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="w-full md:w-4/5">
      <img src={bot} className="h-9 w-9 rounded-full object-cover object-center"/>
      <pre className="bg-green-500/[.16] p-4 rounded-xl font-sans text-base"  style={{whiteSpace: "pre-wrap"}}>
        {text}
      </pre>
    </div>
  );
}

export default Answer;