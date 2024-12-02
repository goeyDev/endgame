import { useState,useEffect } from "react";
import { languages } from "./languages";
import test from '../public/pygmy-hippopotamus.jpg'
import { getFarewellText,getRandomWord } from "./utils";
import { clsx } from "clsx";
import "./App.css";
import Confetti from "react-confetti";
// import song from './assets/Rich18.mp3';
// 134155 functionality
// 141214
function AssemblyEndgame() {
 
  // state values
  const [currentWord, setcurrentWord] = useState(getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);


  // Derived values
  const numGuessesLeft = languages.length - 1;
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.name.includes(letter)
  ).length;
  const isGameWon = currentWord.name
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const isGameLost = wrongGuessCount >= numGuessesLeft;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessedIncorrect =
    lastGuessedLetter && !currentWord.name.includes(lastGuessedLetter);

  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
    console.log(guessedLetters);
  }

  function addGuessedLetter1(letter) {
    setGuessedLetters((prevLetters) => {
      const lettersSet = new Set(prevLetters);
      lettersSet.add(letter);
      return Array.from(lettersSet);
    });
  }

  // className={`chip ${isLanguageLost ? "lost" : ""}`}
  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount;
    // console.log("index:",index,"-----isLanguageLost:",isLanguageLost)

    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    const className = clsx("chip", isLanguageLost && "lost")
    // const className = clsx("chip");
    return (
      <span className={className} key={lang.name} style={styles}>
        {lang.name}
      </span>
    );
  });

  // display the letter on the screen
  const letterElements = currentWord.name
    .split("")
    .map((letter, index) => {
      const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
      const letterClassName = clsx(
        isGameLost && !guessedLetters.includes(letter) && "missed-letter"
      )
      return(
        <span key={index} className={letterClassName}>
          { shouldRevealLetter ? letter.toUpperCase() : ""}
        </span>
      )
      
    });
      

  const keyboardElements = alphabet.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.name.includes(letter);
    const isWrong = isGuessed && !currentWord.name.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        key={letter}
        onClick={() => addGuessedLetter(letter)}
        className={className}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessedIncorrect,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessedIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2>You Win!</h2>
          <p>Well done!</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2>Game Over!</h2>
          <p>You lose! Better start learning Assembly!</p>
        </>
      );
    }
    return null;
  }

  function startNewGame(){
    setcurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  // recycle={false}
  // numberOfPieces={1000}

  useEffect(() => {
    const music = new Audio('Rich18.mp3');
    music.loop = true;
    music.play();

    // Cleanup to stop the music when the component unmounts
    return () => {
      music.pause();
    };
  }, [isGameWon]);
  
  return (
    <main>

      {
        isGameWon && <Confetti
        />
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world sage
          from Assembly.
        </p>
      </header>

      <section className={gameStatusClass} aria-live="polite" role="status">
        {renderGameStatus()}
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="word">{letterElements}</section>
      <div className="images">
      {/* <img src={`${import.meta.env.PUBLIC_URL}${currentWord.imgUrl}`} /> */}
      {/* <img src={`/images${currentWord.imgUrl}`} alt="Dynamic Image" /> */}
          {/* <img src={process.env.PUBLIC_URL + '/yourPathHere.jpg'} />  */}
          <img src={currentWord.imgUrl} width={300}/>
         
        </div>
        {/* <div>
        <img src={test} width="300" alt="Pygmy Hippopotamus" />
        </div> */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>{currentWord.name.includes(lastGuessedLetter) ? `Correct! The letter ${lastGuessedLetter} is in the word.`
        :`Sorry,The letter ${lastGuessedLetter} is not in the word.`}
        You have {numGuessesLeft} attempts left.
        </p>


      <p>Current word:{currentWord.name.split("").map(letter => guessedLetters.includes(letter) ? letter + "." : "blank.").join("")}</p>
      </section>
      <section className="keyboard">{keyboardElements}</section>
      {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    </main>
  );
}

export default AssemblyEndgame;

{
  /* <section className="game-status">
  {isGameOver ?(
    isGameWon ?(
      <>
      <h2>You Win!</h2>
      <p>Well done!</p></>
    ):(
      <>
      <h2>Game Over!</h2>
      <p>You lose! Better start learning Assembly!</p>
      </>
    )
  ) :null}
</section>  */
}
