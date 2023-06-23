import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishedScreen from "./components/FinishedScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
import {
  ActionKind,
  ActionType,
  QuestionType,
  StateType,
  Status,
} from "./types";

const initialState: StateType = {
  questions: [],
  status: Status.loading,
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

const SECONDS_PER_QUESTION = 30;

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case ActionKind.DATA_RECEIVED:
      return { ...state, questions: action.payload, status: Status.ready };
    case ActionKind.DATA_FAILED:
      return { ...state, status: Status.error };
    case ActionKind.START:
      return {
        ...state,
        status: Status.active,
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
      };
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
    case ActionKind.NEXT_QUESTION:
      return { ...state, index: state.index + 1, answer: null };
    case ActionKind.FINISH:
      return {
        ...state,
        status: Status.finished,
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case ActionKind.RESTART:
      return {
        ...initialState,
        questions: state.questions,
        status: Status.ready,
      };
    case ActionKind.TICK:
      return {
        ...state,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        secondsRemaining: state.secondsRemaining! - 1,
        status: state.secondsRemaining === 0 ? Status.finished : Status.active,
      };
    default:
      return state;
  }
}

function App() {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, val) => acc + val.points, 0);

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
          <>
            <Progress
              idx={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === Status.finished && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
