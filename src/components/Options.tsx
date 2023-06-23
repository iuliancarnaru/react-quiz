import { ActionKind, ActionType, QuestionType } from "../App";

interface OptionsProps {
  question: QuestionType;
  dispatch: React.Dispatch<ActionType>;
  answer: null | number;
}

function Options({ question, dispatch, answer }: OptionsProps) {
  const hasAnswer = answer !== null;

  return (
    <div className="options">
      {question.options?.map((option, idx) => (
        <button
          key={option}
          disabled={hasAnswer}
          className={`btn btn-option ${idx === answer ? "answer" : ""} ${
            hasAnswer
              ? idx === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          onClick={() =>
            dispatch({
              type: ActionKind.NEW_ANSWER,
              payload: Number(idx),
            })
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
