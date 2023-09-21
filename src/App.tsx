import { useEffect, useState, useRef } from "react";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Dialog,
} from "@mui/material";
import Card from "./Card";
import "./App.scss";


type cardObj = {[key: string]: string};
interface IClearedCards {[key: string]: boolean};


const uniqueElementsArray: cardObj[] = [
    {
        type: "Bear",
        image: `https://cloud.modyocdn.com/uploads/f0753a4f-87b2-484d-aeb1-a22c3278cb50/original/bear.jpg`
    },
    {
        type: "Bird",
        image: `https://cloud.modyocdn.com/uploads/651e2381-dc33-43fc-8762-58079ffb36d1/original/bird.jpg`
    },
    {
        type: "Cat",
        image: `https://cloud.modyocdn.com/uploads/bf9df521-88bb-44f5-8853-d7f9a5f4aa60/original/cat.jpg`
    },
    {
        type: "Deer",
        image: `https://cloud.modyocdn.com/uploads/1072dca9-1c9b-4a76-abfb-1d70d7dd861b/original/deer.jpg`
    },
    {
        type: "Dog",
        image: `https://cloud.modyocdn.com/uploads/c10dc024-71f4-4a60-a3b7-2c53ffe2522d/original/dog.jpg`
    },
    {
        type: "Dolphin",
        image: `https://cloud.modyocdn.com/uploads/db3322be-03ac-41af-be11-7944fcef7fa0/original/dolphin.jpg`
    }
];


function shuffleCards(array: cardObj[]): cardObj[] {
    const len = array.length;

    for (let i = len; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * i);
        const currentIndex = i - 1;
        const temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }

    return array;
}


export default function App() {
    const [cards, setCards] = useState<cardObj[]>(
        shuffleCards.bind(null, uniqueElementsArray.concat(uniqueElementsArray))
    );
    const [openCards, setOpenCards] = useState<number[]>([]);
    const [clearedCards, setClearedCards] = useState<IClearedCards>({});
    const [shouldDisableAllCards, setShouldDisableAllCards] = useState<boolean>(false);
    const [moves, setMoves] = useState<number>(0);
    const [hits, setHits] = useState<number>(0);
    const [misses, setMisses] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [bestScore, setBestScore] = useState<number>(
        JSON.parse(localStorage.getItem("bestScore") as string) || Number.POSITIVE_INFINITY
    );
    const timeout = useRef<null | ReturnType<typeof setTimeout>>(null);


    const disable = () => setShouldDisableAllCards(true);
    const enable = () => setShouldDisableAllCards(false);


    const checkCompletion = () => {
        if (Object.keys(clearedCards).length === uniqueElementsArray.length) {
            setShowModal(true);
            const highScore = Math.min(moves, bestScore);
            setBestScore(highScore);
            localStorage.setItem("bestScore", highScore.toString());
        }
    };


    const evaluate = () => {
        const [first, second] = openCards;
        enable();

        if (cards[first].type === cards[second].type) {
            setClearedCards((prev) => ({ ...prev, [cards[first].type]: true }));
            setOpenCards([]);
            setHits(hits => hits + 1);
            return;
        }

        setMisses(miss => miss + 1);

        // This is to flip the cards back after 500ms duration
        timeout.current = setTimeout(() => {
            setOpenCards([]);
        }, 500);
    };


    const handleCardClick = (index: number) => {
        if (openCards.length === 1) {
            setOpenCards((prev) => [...prev, index]);
            setMoves(moves => moves + 1);
            disable();
        } else {
            clearTimeout(Number(timeout.current));
            setOpenCards([index]);
        }
    };


    useEffect(() => {
        let timeoutID: null | ReturnType<typeof setTimeout> = null;

        if (openCards.length === 2) {
            timeoutID = setTimeout(evaluate, 300);
        }

        return () => clearTimeout(Number(timeoutID));
    }, [openCards]);


    useEffect(() => {
        checkCompletion();
    }, [clearedCards]);


    const checkIsFlipped = (index: number): boolean => {
        return openCards.includes(index);
    };


    const checkIsInactive = (card: cardObj): boolean => {
        return Boolean(clearedCards[card.type]);
    };


    const handleRestart = () => {
        setClearedCards({});
        setOpenCards([]);
        setShowModal(false);
        setMoves(0);
        setHits(0);
        setMisses(0);
        setShouldDisableAllCards(false);
        // set a shuffled deck of cards
        setCards(shuffleCards(uniqueElementsArray.concat(uniqueElementsArray)));
    };

    return (
        <div className="App">
            <header>
                <h3>Play the Flip card game</h3>
                <div>
                    Select two cards with same content consequtively to make them vanish
                </div>
            </header>
            <div className="container">
                {cards.map((card, index) => {
                    return (
                        <Card
                            key={index}
                            card={card}
                            index={index}
                            isDisabled={shouldDisableAllCards}
                            isInactive={checkIsInactive(card)}
                            isFlipped={checkIsFlipped(index)}
                            onClick={handleCardClick}
                        />
                    );
                })}
            </div>
            <footer>
                <div className="score">
                    <div className="moves">
                        <span className="bold">Moves:</span> {moves}
                    </div>

                    <div className="hits">
                        <span className="bold">Hits:</span> {hits}
                    </div>

                    <div className="misses">
                        <span className="bold">Misses:</span> {misses}
                    </div>

                    {localStorage.getItem("bestScore") && (
                        <div className="high-score">
                            <span className="bold">Best Score:</span> {bestScore}
                        </div>
                    )}
                </div>
                <div className="restart">
                    <Button onClick={handleRestart} color="primary" variant="contained">
                        Restart
                    </Button>
                </div>
            </footer>
            <Dialog
                open={showModal}
                disableEscapeKeyDown
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Hurray!!! You completed the challenge
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You completed the game in {moves} moves. Your best score is{" "}
                        {bestScore} moves.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRestart} color="primary">
                        Restart
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
