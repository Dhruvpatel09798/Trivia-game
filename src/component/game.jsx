import React, { useEffect, useState } from "react";

const Game = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=10");
        const data = await response.json();
        const transformedData = transformQuizData(data);
        setQuizData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // accessing data from api-----------------------------------------------------

  const transformQuizData = (data) => {
    return data.results.map((question) => {
      const options = [question.correct_answer, ...question.incorrect_answers];
      return {
        ...question,
        options: shuffleArray(options),
      };
    });
  };
 // --------------------------------------------------------------------------------


 // for shuffel the option------------------------------------------------------------

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };
 //-----------------------------------------------------------------------------------------



  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    setFeedback("");
    setSelectedAnswer(null);
    setSubmitted(false);
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === quizData[currentQuestion].correct_answer) {
      setFeedback("Correct!");
      setScore(score + 1);
    } else {
      setFeedback(
        `Wrong! The correct answer is ${quizData[currentQuestion].correct_answer}`
      );
    }
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="flex m-auto items-center justify-center text-3xl">
        Loading...
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="flex flex-col w-1/4 bg-white/30 m-auto mt-8 border min-w-80 rounded-xl backdrop-blur-md">
        <h1 className="flex text-3xl items-center justify-center font-medium">
          Results
        </h1>
        <p className="flex text-xl items-center justify-center font-medium">
          Total Questions: {quizData.length}
        </p>
        <p className="flex text-xl items-center justify-center font-medium">
          Correct Answers: {score}
        </p>
        <p className="flex text-xl items-center justify-center font-medium">
          Incorrect Answers: {quizData.length - score}
        </p>
      </div>
    );
  }

  return (
    <div className="flex ju justify-center items-center  min-w-80 my-20">
      <h1></h1>
      {quizData.length > 0 && (
        <div className="flex flex-col w-2/4 bg-white/30 gap-5 m-auto rounded-xl min-w-80 border backdrop-blur-md ">
          <h2 className="text-xl font-semibold">
            <span className="text-2xl font-bold">{currentQuestion + 1}.</span>{quizData[currentQuestion].question}
          </h2>
          <ul className="flex flex-col">
            {quizData[currentQuestion].options.map((option, index) => (
              <li
                className="flex items-center font-medium border-2 border-sky-500 h-10 rounded-xl my-1 text-lg hover:border-sky-700 cursor-pointer"
                key={index}
                onClick={() => handleAnswerClick(option)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: submitted
                    ? option === quizData[currentQuestion].correct_answer
                      ? '#01510187'
                      : option === selectedAnswer
                      ? '#f7040461'
                      : 'transparent'
                    : selectedAnswer === option
                    ? '#ddd'
                    : 'transparent',
                  color: submitted && option === quizData[currentQuestion].correct_answer ? 'white' : 'black'
                }}
              >
                {option}
              </li>
            ))}
          </ul>
          {!submitted ? (
            <button
              className="text-white text-xl bg-sky-600 w-28 h-8 rounded-xl m-auto hover:bg-sky-500"
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit
            </button>
          ) : (
            <div className="flex flex-col m-auto">
              <p className="text-xl font-semibold">{feedback}</p>
              <button
                className="text-white text-xl bg-sky-600 w-28 h-8 rounded-xl m-auto hover:bg-sky-500"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
