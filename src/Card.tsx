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


const Card = ({ onClick, card, index, isInactive, isFlipped, isDisabled }: ICard) => {
    const handleClick = () => {
        !isFlipped && !isDisabled && onClick(index);
    };


    return (
        <div
            className={classnames("card", {
                "is-flipped": isFlipped,
                "is-inactive": isInactive
            })}
            onClick={handleClick}
        >
            <div className="card-face card-font-face">
                <span>?</span>
            </div>
            <div className="card-face card-back-face">
                <img src={card.image} alt={card.type} />
            </div>
        </div>
    );
};

export default Card;