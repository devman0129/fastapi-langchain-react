import human from "./img/human.png";

const Question = (props) => {
  return (
    <div className="self-end w-full md:w-2/6 my-2">
      <img src={human} className="h-9 w-9 mb-1 rounded-full object-cover object-center"/>
      <pre className="bg-brown-500/[.16] p-4 rounded-xl font-serif text-base" style={{whiteSpace: "pre-wrap"}}>
        {props.value}
      </pre>
    </div>
  );
}

export default Question;