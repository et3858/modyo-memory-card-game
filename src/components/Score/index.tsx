import "./index.scss";


interface IProps {
    moves: number,
    hits: number,
    misses: number,
    bestScore?: string | null,
};


export default function Score({ moves, hits, misses, bestScore = null }: IProps) {
    return(
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

            {bestScore ?
                <div className="high-score">
                    <span className="bold">Best Score:</span> {bestScore}
                </div>
            : null}
        </div>
    );
}
