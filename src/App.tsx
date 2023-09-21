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
import type { CardType, EntryCardType } from "./types";


function shuffleCards(array: CardType[]): CardType[] {
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
    const [originalCards, setOriginalCards] = useState<CardType[]>([]);
    const [cards, setCards] = useState<CardType[]>([]);
    const [openCards, setOpenCards] = useState<number[]>([]);
    const [clearedCards, setClearedCards] = useState<{[key: string]: boolean}>({});
    const [shouldDisableAllCards, setShouldDisableAllCards] = useState<boolean>(false);
    const [moves, setMoves] = useState<number>(0);
    const [hits, setHits] = useState<number>(0);
    const [misses, setMisses] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showNameModal, setShowNameModal] = useState<boolean>(false);
    const [bestScore, setBestScore] = useState<number>(
        JSON.parse(localStorage.getItem("bestScore") as string) || Number.POSITIVE_INFINITY
    );
    const [playerName, setPlayerName] = useState<string>(
        localStorage.getItem("playerName") || ""
    );
    const [inputText, setInputText] = useState<string>("");


    const timeout = useRef<null | ReturnType<typeof setTimeout>>(null);


    const disable = () => setShouldDisableAllCards(true);
    const enable = () => setShouldDisableAllCards(false);


    const checkCompletion = () => {
        if (originalCards.length > 0 && Object.keys(clearedCards).length === originalCards.length) {
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


    const handleSavePlayerNameClick = () => {
        setPlayerName(inputText);
        localStorage.setItem("playerName", inputText);
        setShowNameModal(false);
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
        const URL = "https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20";

        fetch(URL)
            .then(response => response.json())
            .then(data => {
                const entryCards = data.entries.map(({ fields, meta }: EntryCardType) => ({
                    type: meta.slug,
                    image: fields.image.url,
                }));
                setOriginalCards(entryCards);
                setCards(shuffleCards(entryCards.concat(entryCards)));
            });
    }, []);


    useEffect(() => {
        if (!playerName) {
            setShowNameModal(true);
        }
    }, [playerName]);


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


    const checkIsInactive = (card: CardType): boolean => {
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
        setCards(shuffleCards(originalCards.concat(originalCards)));
    };

    return (
        <div className="App">
            <header>
                <h3>Play the Flip card game</h3>
                <div>
                    Select two cards with same content consequtively
                </div>

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
                <div className="restart">
                    <Button onClick={handleRestart} color="primary" variant="contained">
                        Restart
                    </Button>
                </div>
            </footer>

            <Dialog
                open={showNameModal}
                disableEscapeKeyDown
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Type your name
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <p>Please, type your name before playing</p>

                        <br />

                        <div className="rounded-full border-solid border-2 border-gray-200 overflow-hidden">
                            <input
                                className="w-full outline-none p-2 bg-transparent"
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleSavePlayerNameClick}
                        color="primary"
                        disabled={!inputText}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showModal}
                disableEscapeKeyDown
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Hurray!!! You completed the challenge {playerName}
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

                    <Button onClick={() => setShowModal(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
