import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Dialog,
} from "@mui/material";


interface IProps {
    showModal: boolean,
    playerName: string,
    moves: number,
    bestScore: number,
    onRestart: Function,
    onClose: Function
};


const CongratsModal = ({ showModal, playerName, moves, bestScore, onRestart, onClose }: IProps) => {
    const handleRestart = () => onRestart();
    const handleClose = () => onClose();


    return(
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

                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CongratsModal;
