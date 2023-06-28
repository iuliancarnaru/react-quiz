import { useQuiz } from "../contexts/QuizContext";

function NextButton() {
  const { handleNextQuestion, handleFinish, answer, index, numQuestions } =
    useQuiz();
  if (answer === null) return null;

  if (index < numQuestions - 1) {
    return (
      <button className="btn btn-ui" onClick={handleNextQuestion}>
        Next
      </button>
    );
  }

  if (index === numQuestions - 1) {
    return (
      <button className="btn btn-ui" onClick={handleFinish}>
        Finish
      </button>
    );
  }
}

export default NextButton;
