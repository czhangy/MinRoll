// Stylesheet
import styles from "@/styles/Profile/DeleteModal.module.scss";
// TS
import { SyntheticEvent } from "react";

type Props = {
    open: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

const DeleteModal: React.FC<Props> = ({ open, onConfirm, onClose }: Props) => {
    // Stops click on content from closing modal
    const contentClick = (e: SyntheticEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            id={styles["delete-modal"]}
            className={open ? styles["show-overlay"] : ""}
            onClick={onClose}
        >
            <div id={styles["delete-modal-content"]} onClick={contentClick}>
                <h2 id={styles["delete-header"]}>
                    Deleting this build cannot be undone.
                    <br />
                    Are you sure?
                </h2>
                <div id={styles["delete-buttons"]}>
                    <button
                        className={styles["delete-button"]}
                        onClick={onClose}
                    >
                        No
                    </button>
                    <button
                        className={styles["delete-button"]}
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
