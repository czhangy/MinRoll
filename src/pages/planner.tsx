// Stylesheet
import styles from "@/styles/Planner/Planner.module.scss";
// TS
import { NextPage } from "next";
import Build from "@/models/Build";
import AuthContext from "@/models/AuthContext";
import { SyntheticEvent } from "react";
import Gear from "@/models/Gear";
// Local components
import BuildPanel from "@/components/BuildPanel/BuildPanel";
import Dropdown from "@/components/Planner/Dropdown";
import GearPage from "@/components/Planner/GearPage";
import DescriptionPage from "@/components/Planner/DescriptionPage";
// React
import { useState } from "react";
// React Context
import { useAuth } from "@/contexts/AuthContext";
// Next
import Head from "next/head";

const Planner: NextPage = () => {
    // Get user
    const { user } = useAuth() as AuthContext;

    // Build state
    const [build, setBuild] = useState<Build>({
        name: "",
        class: "",
        description: "",
        gear: {
            head: null,
            shoulders: null,
            torso: null,
            hands: null,
            wrists: null,
            waist: null,
            legs: null,
            feet: null,
            neck: null,
            "left-finger": null,
            "right-finger": null,
            "main-hand": null,
            "off-hand": null,
        },
        cube: {
            weapon: null,
            armor: null,
            jewelry: null,
        },
    });
    const selectClass = (newClass: string | Gear) => {
        setBuild({
            ...build,
            class: newClass as string,
        });
    };
    const nameBuild = (e: SyntheticEvent) => {
        setBuild({
            ...build,
            name: (e.target as HTMLInputElement).value,
        });
    };
    const selectGear = (slot: string, item: Gear) => {
        setBuild({
            ...build,
            gear: {
                ...build.gear,
                [slot]: item,
            },
        });
    };
    const selectCube = (slot: string, item: Gear) => {
        setBuild({
            ...build,
            cube: {
                ...build.cube,
                [slot]: item,
            },
        });
    };
    const updateDescription = (e: SyntheticEvent) => {
        const newDescription: string = (e.target as HTMLTextAreaElement).value;
        setBuild({
            ...build,
            description: newDescription,
        });
    };

    // Page state
    const [page, setPage] = useState<number>(0);
    const goToPage = (newPage: number) => {
        setPage(newPage);
    };
    const renderPage = () => {
        if (page === 0)
            return (
                <GearPage
                    className={build.class}
                    gear={build.gear}
                    cube={build.cube}
                    onGearSelect={selectGear}
                    onCubeSelect={selectCube}
                />
            );
        if (page === 2)
            return (
                <DescriptionPage
                    value={build.description as string}
                    onChange={updateDescription}
                />
            );
    };

    // Handle submission
    const saveBuild = () => {
        if (validateBuild()) console.log(build);
    };
    const validateBuild: () => boolean = () => {
        let newErrors = {
            name: false,
            class: false,
            submit: false,
        };
        // Build name
        if (build.name.length === 0) newErrors.name = true;
        // Class selected
        if (!build.class) newErrors.class = true;
        return Object.values(newErrors).every((error) => !error);
    };

    // Page names
    const pageNames = ["Gear", "Skills", "Description"];

    // All classes
    const classNames = [
        "barbarian",
        "crusader",
        "demon-hunter",
        "monk",
        "necromancer",
        "witch-doctor",
        "wizard",
    ];

    return (
        <div id={styles.planner}>
            <Head>
                <title>Develop Your Build</title>
            </Head>
            <p id={styles["planner-error"]}>
                Sorry!
                <br />
                <br />
                This page must be viewed on a larger screen.
            </p>
            <div id={styles["planner-build"]}>
                <Dropdown
                    content={classNames}
                    placeholder="Select a class..."
                    hasIcon={true}
                    isSearchable={false}
                    onSelect={selectClass}
                />
                <BuildPanel gear={build.gear} cube={build.cube} />
                <div id={styles["build-footer"]}>
                    <input
                        id={styles["build-name"]}
                        placeholder="Name your build!"
                        value={build.name}
                        onChange={nameBuild}
                    />
                    <button id={styles["save-button"]} onClick={saveBuild}>
                        SAVE
                    </button>
                </div>
            </div>
            <div id={styles["planner-content"]}>
                <nav id={styles["content-nav"]}>
                    {pageNames.map((name, i) => {
                        return (
                            <button
                                className={`${styles["nav-button"]} ${
                                    page === i ? styles.active : ""
                                }`}
                                onClick={() => goToPage(i)}
                                key={i}
                            >
                                {name}
                            </button>
                        );
                    })}
                </nav>
                {renderPage()}
            </div>
        </div>
    );
};

export default Planner;
