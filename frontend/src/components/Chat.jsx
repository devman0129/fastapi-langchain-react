import Question from "./Question";
import Answer from "./Answer";
import Input from "./Input";

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spinner } from "@material-tailwind/react";

const Chat = ({ QA, status }) => {
  return (
    <div className="mx-5 sm:mx-20 md:mx-30 lg:mx-60 flex flex-col align-start">
      {
        QA.map((element, index) => {
          return (
            <>
              <Question value={element.question} />
              <Answer value={element.answer} />
            </>
          )
        })
      }
      <br />
      {
        status == true ? <Spinner className="ml-[50%] h-10 w-10 text-blue-500/10" /> : ""
      }
      <br /><br /><br /><br />
      <div className="fixed bottom-2 left-1/4 right-1/4">
        <Input />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  QA: state.qaReducer.QA,
  status: state.qaReducer.status
});

export default connect(mapStateToProps, { })(Chat);