// Stylesheet
import styles from "@/styles/Planner/Planner.module.scss";
// TS
import { NextPage } from "next";
import Build from "@/models/Build";
import AuthContext from "@/models/AuthContext";
import { SyntheticEvent } from "react";
import Skill from "@/models/Skill";
import Gear from "@/models/Gear";
import Rune from "@/models/Rune";
// Local components
import BuildPanel from "@/components/BuildPanel/BuildPanel";
import Dropdown from "@/components/Planner/Dropdown";
import GearPage from "@/components/Planner/GearPage";
import SkillsPage from "@/components/Planner/SkillsPage";
import DescriptionPage from "@/components/Planner/DescriptionPage";
// React
import { useState, useEffect } from "react";
// React Context
import { useAuth } from "@/contexts/AuthContext";
// Next
import Head from "next/head";
// Axios
import axios from "axios";

const Planner: NextPage = () => {
    // Get user
    const { user } = useAuth() as AuthContext;

    // Build state
    const defaultBuild: Build = {
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
        skills: new Array(6).fill(null),
        passives: new Array(4).fill(null),
    };
    const defaultRuneLists: Rune[][] = [[], [], [], [], [], []];
    const [build, setBuild] = useState<Build>(defaultBuild);
    const [runeLists, setRuneLists] = useState<Rune[][]>(defaultRuneLists);
    const selectClass = (newClass: string) => {
        setBuild({
            ...build,
            class: newClass,
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
    const selectSkill = (ind: number, skill: Skill) => {
        // Fetch runes and set state
        axios
            .get("/api/skills", {
                params: { className: build.class, skillName: skill.slug },
            })
            .then((response) =>
                setRuneLists([
                    ...runeLists.slice(0, ind),
                    response.data,
                    ...runeLists.slice(ind + 1, 6),
                ])
            );
        // Set state of skills
        const newSkills: Array<Skill | null> = [
            ...build.skills.slice(0, ind),
            skill,
            ...build.skills.slice(ind + 1, 6),
        ];
        setBuild({
            ...build,
            skills: newSkills,
        });
    };
    const selectRune = (ind: number, rune: Rune) => {
        let newSkill: Skill = build.skills[ind] as Skill;
        newSkill.rune = rune;
        const newSkills: Array<Skill | null> = [
            ...build.skills.slice(0, ind),
            newSkill,
            ...build.skills.slice(ind + 1, 6),
        ];
        setBuild({
            ...build,
            skills: newSkills,
        });
    };
    const selectPassive = (ind: number, passive: Skill) => {
        // Set state of passives
        const newPassives: Array<Skill | null> = [
            ...build.passives.slice(0, ind),
            passive,
            ...build.passives.slice(ind + 1, 6),
        ];
        setBuild({
            ...build,
            passives: newPassives,
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
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Class data
    const [gearList, setGearList] = useState<Gear[]>([]);
    const [skillList, setSkillList] = useState<Skill[]>([]);
    const [passiveList, setPassiveList] = useState<Skill[]>([]);

    // Clear build on class and refetch data
    useEffect(() => {
        setBuild({
            ...defaultBuild,
            class: build.class,
        });
        setRuneLists(defaultRuneLists);
        if (build.class !== "") {
            setIsLoading(true);
            // Fetch gear
            const gear: Promise<void> = axios
                .get("/api/gear", { params: { className: build.class } })
                .then((response) => setGearList(response.data))
                .catch((error) => console.log(error));
            // Fetch skills
            const skills: Promise<void> = axios
                .get("/api/skills", { params: { className: build.class } })
                .then((response) => setSkillList(response.data))
                .catch((error) => console.log(error));
            // Fetch passives
            const passives: Promise<void> = axios
                .get("/api/passives", { params: { className: build.class } })
                .then((response) => setPassiveList(response.data))
                .catch((error) => console.log(error));
            // Loading complete
            Promise.all([gear, skills, passives]).then(() =>
                setIsLoading(false)
            );
        }
    }, [build.class]);

    // Page state
    const [page, setPage] = useState<number>(0);
    const goToPage = (newPage: number) => {
        setPage(newPage);
    };
    const renderPage = () => {
        if (page === 0)
            return (
                <GearPage
                    gearList={gearList}
                    savedGear={build.gear}
                    savedCube={build.cube}
                    onGearSelect={selectGear}
                    onCubeSelect={selectCube}
                />
            );
        if (page === 1)
            return (
                <SkillsPage
                    skillList={skillList}
                    runeLists={runeLists}
                    passiveList={passiveList}
                    savedSkills={build.skills}
                    savedPassives={build.passives}
                    onSkillSelect={selectSkill}
                    onRuneSelect={selectRune}
                    onPassiveSelect={selectPassive}
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
                    onSelect={selectClass}
                    isLoading={isLoading}
                />
                <BuildPanel
                    gear={build.gear}
                    cube={build.cube}
                    skills={build.skills}
                    passives={build.passives}
                />
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
