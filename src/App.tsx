import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";

export interface QuestionType {
  question: string;
  options?: string[] | null;
  correctOption: number;
  points: number;
}

export enum ActionKind {
  DATA_RECEIVED = "DATA_RECEIVED",
  DATA_FAILED = "DATA_FAILED",
  START = "START",
  NEW_ANSWER = "NEW_ANSWER",
}

export type ActionType =
  | {
      type: ActionKind.DATA_RECEIVED;
      payload: QuestionType[];
    }
  | {
      type: ActionKind.DATA_FAILED;
      payload: string;
    }
  | {
      type: ActionKind.START;
    }
  | {
      type: ActionKind.NEW_ANSWER;
      payload: number;
    };

enum Status {
  loading = "loading",
  error = "error",
  ready = "ready",
  active = "active",
  finished = "finished",
}

type StateType = {
  questions: QuestionType[];
  status: Status;
  index: number;
  answer: null | number;
  points: number;
};

const initialState: StateType = {
  questions: [],
  status: Status.loading,
  index: 0,
  answer: null,
  points: 0,
};

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case ActionKind.DATA_RECEIVED:
      return { ...state, questions: action.payload, status: Status.ready };
    case ActionKind.DATA_FAILED:
      return { ...state, status: Status.error };
    case ActionKind.START:
      return { ...state, status: Status.active };
    case ActionKind.NEW_ANSWER:
      // eslint-disable-next-line no-case-declarations
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question?.correctOption
            ? state.points + question.points
            : state.points,
      };
    default:
      return state;
  }
}

function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions = questions.length;

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data: QuestionType[]) =>
        dispatch({
          type: ActionKind.DATA_RECEIVED,
          payload: data,
        })
      )
      .catch((err: Error) =>
        dispatch({
          type: ActionKind.DATA_FAILED,
          payload: err.message,
        })
      );
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === Status.loading && <Loader />}
        {status === Status.error && <Error />}
        {status === Status.ready && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === Status.active && (
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
