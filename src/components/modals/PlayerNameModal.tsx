import { useState } from "react";
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
    onSave: Function,
}


const PlayerNameModal = ({ showModal, onSave }: IProps) => {
    const [inputText, setInputText] = useState<string>("")


    const handleSaveClick = () => {
        onSave(inputText);
    };


    return(
        <Dialog
            open={showModal}
            disableEscapeKeyDown
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Type your name
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" component={"p"}>
                    Please, type your name before playing
                </DialogContentText>

                <DialogContentText component={"br"} />

                <DialogContentText component={"div"} className="rounded-full border-solid border-2 border-gray-200 overflow-hidden">
                    <input
                        className="w-full outline-none p-2 bg-transparent"
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleSaveClick}
                    color="primary"
                    disabled={!inputText}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default PlayerNameModal;
