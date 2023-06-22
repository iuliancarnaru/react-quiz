import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";

export interface Question {
  question: string;
  options?: string[] | null;
  correctOption: number;
  points: number;
}

enum ActionKind {
  DATA_RECEIVED = "DATA_RECEIVED",
  DATA_FAILED = "DATA_FAILED",
}

type ActionType =
  | {
      type: ActionKind.DATA_RECEIVED;
      payload: Question[];
    }
  | {
      type: ActionKind.DATA_FAILED;
      payload: string;
    };

enum Status {
  loading = "loading",
  error = "error",
  ready = "ready",
  active = "active",
  finished = "finished",
}

type StateType = {
  questions: Question[];
  status: Status;
};

const initialState: StateType = {
  questions: [],
  status: Status.loading,
};

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case ActionKind.DATA_RECEIVED:
      return { ...state, questions: action.payload, status: Status.ready };
    case ActionKind.DATA_FAILED:
      return { ...state, status: Status.error };
    default:
      throw new Error("Unknown action type");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data: Question[]) =>
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
        <p>1/20</p>
      </Main>
    </div>
  );
}

export default App;
