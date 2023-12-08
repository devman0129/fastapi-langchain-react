import axios from 'axios';
import { QA_ADD, LOADING } from "./types";

export const answerFunc = (formData) => async (dispatch) => {
  try {
    dispatch({type: LOADING, payload: true});
    const res = await axios.post('http://localhost:8000/get_chat_answer', formData)
    dispatch({type: LOADING, payload: false});
    dispatch({type:QA_ADD, payload:res.data});
  } catch (err) {
    dispatch({type: LOADING, payload: false});
    const errors = err.response.data.errors;

    if (errors) {
    }
  }
};