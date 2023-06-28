import { useQuiz } from "../contexts/QuizContext";

function Options() {
  const { questions, index, answer, handleNewAnswer } = useQuiz();
  const hasAnswer = answer !== null;

  return (
    <div className="options">
      {questions[index].options?.map((option, idx) => (
        <button
          key={option}
          disabled={hasAnswer}
          className={`btn btn-option ${idx === answer ? "answer" : ""} ${
            hasAnswer
              ? idx === questions[index].correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          onClick={() => handleNewAnswer(idx)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
