import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@mui/material";
import Card from "./components/Card";
import Score from "./components/Score";
import CardSkeleton from "./components/skeletons/CardSkeleton";
import CongratsModal from "./components/modals/CongratsModal";
import PlayerNameModal from "./components/modals/PlayerNameModal";
import "./App.scss";
import type { TCard, TEntryCard } from "./types";


const CARD_SKELETONS = Array.from(Array(40));


function shuffleCards(array: TCard[]): TCard[] {
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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [isFailed, setIsFailed] = useState<boolean>(false);
    const [originalCards, setOriginalCards] = useState<TCard[]>([]);
    const [cards, setCards] = useState<TCard[]>([]);
    const [openCards, setOpenCards] = useState<number[]>([]);
    const [clearedCards, setClearedCards] = useState<{[key: string]: boolean}>({});
    const [shouldDisableAllCards, setShouldDisableAllCards] = useState<boolean>(false);
    const [hits, setHits] = useState<number>(0);
    const [misses, setMisses] = useState<number>(0);
    const [showCongratsModal, setShowCongratsModal] = useState<boolean>(false);
    const [showNameModal, setShowNameModal] = useState<boolean>(false);
    const [bestScore, setBestScore] = useState<number>(
        JSON.parse(localStorage.getItem("bestScore") as string) || Number.POSITIVE_INFINITY
    );
    const [playerName, setPlayerName] = useState<string>(
        localStorage.getItem("playerName") || ""
    );
    const moves = useMemo<number>(() => hits + misses, [hits, misses]);


    const timeout = useRef<null | ReturnType<typeof setTimeout>>(null);


    const disable = () => setShouldDisableAllCards(true);
    const enable = () => setShouldDisableAllCards(false);


    const checkCompletion = () => {
        if (originalCards.length > 0 && Object.keys(clearedCards).length === originalCards.length) {
            const highScore = Math.min(moves, bestScore);
            setBestScore(highScore);
            localStorage.setItem("bestScore", highScore.toString());
            setShowCongratsModal(true);
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


    const handleSavePlayerNameClick = (name: string) => {
        setPlayerName(name);
        localStorage.setItem("playerName", name);
        setShowNameModal(false);
    };


    const handleCardClick = (index: number) => {
        if (openCards.length === 1) {
            setOpenCards((prev) => [...prev, index]);
            disable();
        } else {
            clearTimeout(Number(timeout.current));
            setOpenCards([index]);
        }
    };


    const handleTryLoadingClick = () => {
        setIsFailed(false);
        setIsLoading(true);
        loadContent();
    };


    const loadContent = () => {
        const URL = "https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20";

        fetch(URL)
            .then(response => response.json())
            .then(data => {
                const entryCards = data.entries.map(({ fields, meta }: TEntryCard) => ({
                    type: meta.slug,
                    image: fields.image.url,
                }));
                setOriginalCards(entryCards);
                setCards(shuffleCards(entryCards.concat(entryCards)));

                setIsLoading(false);
                setIsFinished(true);
            })
            .catch(() => {
                setIsLoading(false);
                setIsFailed(true);
            });
    };


    useEffect(() => loadContent(), []);


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


    useEffect(() => checkCompletion(), [clearedCards]);


    const checkIsFlipped = (index: number): boolean => {
        return openCards.includes(index);
    };


    const checkIsInactive = (card: TCard): boolean => {
        return Boolean(clearedCards[card.type]);
    };


    const handleRestart = () => {
        setClearedCards({});
        setOpenCards([]);
        setShowCongratsModal(false);
        setHits(0);
        setMisses(0);
        setShouldDisableAllCards(false);
        // set a shuffled deck of cards
        setCards(shuffleCards(originalCards.concat(originalCards)));
    };

    return (
        <div className="App">
            <header>
                <h1>Play the Flip card game</h1>

                <div>
                    Select two cards with same content consequtively
                </div>

                <div>
                    <span className="bold">Your name:</span> {playerName}
                </div>
            </header>

            {isLoading ?
                <div className="card-container card-container-skeleton">
                    {CARD_SKELETONS.map((_card, index) => <CardSkeleton key={index} />)}
                </div>
            : null}

            {isFailed ?
                <div className="text-center">
                    <p className="mt-10 mb-2">Something went wrong</p>

                    <Button onClick={handleTryLoadingClick} color="primary" variant="contained">
                        Try again
                    </Button>
                </div>
            : null}

            {(isFinished && cards.length > 0) ?
                <>
                <Score moves={moves} hits={hits} misses={misses} bestScore={localStorage.getItem("bestScore")} />

                <div className="card-container">
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            card={card}
                            index={index}
                            isDisabled={shouldDisableAllCards}
                            isInactive={checkIsInactive(card)}
                            isFlipped={checkIsFlipped(index)}
                            onClick={handleCardClick}
                        />
                    ))}
                </div>

                <footer>
                    <div className="restart">
                        <Button onClick={handleRestart} color="primary" variant="contained">
                            Restart
                        </Button>
                    </div>
                </footer>
                </>
            :
                <div className="text-center my-10">
                    <p>It looks like there are not any cards to play. Try it later</p>
                </div>
            }

            <PlayerNameModal
                showModal={showNameModal}
                onSave={handleSavePlayerNameClick}
            />

            <CongratsModal
                showModal={showCongratsModal}
                playerName={playerName}
                moves={moves}
                bestScore={bestScore}
                onRestart={handleRestart}
                onClose={() => setShowCongratsModal(false)}
            />
        </div>
    );
}
