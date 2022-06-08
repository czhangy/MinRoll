// Stylesheet
import styles from "@/styles/Planner/RuneDropdown.module.scss";
// React
import { useState, useEffect } from "react";
// TS
import { SyntheticEvent } from "react";
import Rune from "@/models/Rune";
// Next
import Image from "next/image";

type Props = {
    runeList: Rune[];
    placeholder: string;
    onSelect: (rune: Rune) => void;
    savedRune: Rune | null | undefined;
};

const RuneDropdown: React.FC<Props> = (props: Props) => {
    // Dropdown control
    const [open, setOpen] = useState<boolean>(false);
    const openDropdown = (e: SyntheticEvent) => {
        (e.target as HTMLButtonElement).focus();
        setOpen(true);
    };
    const closeDropdown = () => {
        setTimeout(() => {
            setOpen(false);
        }, 120);
    };

    // Dropdown selected value state
    const [selectedRune, setSelectedRune] = useState<Rune | null>(null);
    const selectRune = (rune: Rune) => {
        // Set dropdown value
        setSelectedRune(rune);
        // Pass to parent
        props.onSelect(rune);
    };

    // Clear input on class/page change
    useEffect(() => {
        setSelectedRune(props.savedRune ? props.savedRune : null);
    }, [props.runeList]);

    return (
        <div className={styles["rune-dropdown"]}>
            <button
                className={styles["dropdown-button"]}
                onClick={openDropdown}
                onBlur={closeDropdown}
                disabled={props.runeList.length === 0}
            >
                {selectedRune ? (
                    <div className={styles["rune-selection"]}>
                        <p className={styles["rune-text"]}>
                            {selectedRune.name}
                        </p>
                    </div>
                ) : (
                    <p
                        className={`${styles["rune-text"]} ${styles.placeholder}`}
                    >
                        {props.placeholder}
                    </p>
                )}
                <div
                    className={`${styles["dropdown-icon"]} ${
                        open ? styles.rotated : ""
                    }`}
                >
                    <Image
                        src={
                            props.runeList.length === 0
                                ? "/icons/lock.svg"
                                : "/icons/chevron-down.svg"
                        }
                        alt=""
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </button>
            <ul
                className={`${styles["rune-options"]} ${
                    open ? styles.show : ""
                }`}
            >
                {props.runeList.map((rune: Rune, i: number) => {
                    return (
                        <li
                            className={styles["rune-option"]}
                            key={i}
                            onClick={() => selectRune(rune)}
                        >
                            {/* <div className={styles["rune-icon"]}>
                                <Image
                                    src={`http://media.blizzard.com/d3/icons/skills/42/${skill.icon}.png`}
                                    alt=""
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div> */}
                            <p className={styles["rune-name"]}>{rune.name}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default RuneDropdown;