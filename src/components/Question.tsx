import { ActionType, QuestionType } from "../types";
import Options from "./Options";

interface QuestionProps {
  question: QuestionType;
  dispatch: React.Dispatch<ActionType>;
  answer: null | number;
}

function Question({ question, dispatch, answer }: QuestionProps) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;
