import { ActionType, ActionKind } from "../types";

interface NextButtonProps {
  dispatch: React.Dispatch<ActionType>;
  answer: null | number;
  index: number;
  numQuestions: number;
}

function NextButton({
  dispatch,
  answer,
  index,
  numQuestions,
}: NextButtonProps) {
  if (answer === null) return null;

  if (index < numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() =>
          dispatch({
            type: ActionKind.NEXT_QUESTION,
          })
        }
      >
        Next
      </button>
    );
  }

  if (index === numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() =>
          dispatch({
            type: ActionKind.FINISH,
          })
        }
      >
        Finish
      </button>
    );
  }
}

export default NextButton;
