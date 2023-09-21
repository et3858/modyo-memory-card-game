import classnames from "classnames";
import "./Card.scss";

interface ICard {
    card: {[key: string]: string},
    index: number,
    isDisabled: boolean,
    isInactive: boolean,
    isFlipped: boolean,
    onClick: Function,
};


const QUESTION_MARK_IMG = "https://static.vecteezy.com/system/resources/previews/007/126/739/non_2x/question-mark-icon-free-vector.jpg";


const Card = ({ onClick, card, index, isInactive, isFlipped, isDisabled }: ICard) => {
    const handleClick = () => {
        !isFlipped && !isDisabled && !isInactive && onClick(index);
    };


    return (
        <div
            className={classnames("card", {
                "is-flipped": isFlipped,
                "is-flipped is-inactive": isInactive,
            })}
            onClick={handleClick}
        >
            <div className="card-face card-font-face">
                <img src={QUESTION_MARK_IMG} alt={"card"} />
            </div>
            <div className="card-face card-back-face">
                <img src={card.image} alt={card.type} />
            </div>
        </div>
    );
};

export default Card;