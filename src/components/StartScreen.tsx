import { ActionKind, ActionType } from "../types";

interface StartScreenProps {
  numQuestions: number;
  dispatch: React.Dispatch<ActionType>;
}

function StartScreen({ numQuestions, dispatch }: StartScreenProps) {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{numQuestions} question to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() =>
          dispatch({
            type: ActionKind.START,
          })
        }
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
