// Stylesheet
import styles from "@/styles/Auth/Auth.module.scss";
// React
import { useState } from "react";
// Next
import Head from "next/head";
import Link from "next/link";
// Axios
import axios from "axios";
// TS
import { NextPage } from "next";
import RegisterData from "@/models/RegisterData";
import RegisterErrors from "@/models/RegisterErrors";

const Register: NextPage = () => {
    // Form state
    const [formData, setFormData] = useState<RegisterData>({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue: string = e.target.value;
        const field: string = e.target.name;
        setFormData({
            ...formData,
            [field]: newValue,
        });
    };
    const clearForm = () => {
        setFormData({
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        });
    };

    // Error state
    const [formErrors, setFormErrors] = useState<RegisterErrors>({
        email: false,
        username: false,
        password: false,
        confirmPassword: false,
        form: false,
    });
    const updateError = (field: string, value: string) => {
        setFormErrors({
            ...formErrors,
            [field]: value,
        });
    };
    const updateErrors = (errors: RegisterErrors) => {
        setFormErrors(errors);
    };
    const clearErrors = () => {
        setFormErrors({
            email: false,
            username: false,
            password: false,
            confirmPassword: false,
            form: false,
        });
    };

    // Form validator
    const validateForm: () => boolean = () => {
        // Reset errors
        clearErrors();
        let errors: RegisterErrors = {
            email: false,
            username: false,
            password: false,
            confirmPassword: false,
            form: false,
        };
        // Email length
        if (formData.email.length === 0) errors.email = "Email must be valid";
        // Username length
        if (formData.username.length > 16 || formData.username.length < 4)
            errors.username = "Usernames must be 4 to 16 characters long";
        // Password length
        if (formData.password.length < 8)
            errors.password = "Passwords must be at least 8 characters long";
        // Confirm password consistency
        if (formData.password !== formData.confirmPassword)
            errors.confirmPassword = "Passwords do not match";
        updateErrors(errors);
        // Check that no errors exist
        return Object.values(errors).every((error) => !error);
    };

    // Submit register form handler
    const submitRegister = (e: React.FormEvent<HTMLFormElement>) => {
        // Prevent page refresh on click
        e.preventDefault();
        // Validate form
        if (validateForm())
            // Send POST request
            axios
                .post("/api/users", formData)
                .then(() => {
                    // Clear form after successful
                    clearForm();
                })
                .catch((error) => {
                    const errorCode: number = error.response.status;
                    // Handle server errors
                    if (errorCode === 400)
                        updateError("email", error.response.data.message);
                    else if (errorCode === 401)
                        updateError("username", error.response.data.message);
                    else {
                        updateError(
                            "form",
                            "Something went wrong, try again later"
                        );
                    }
                    console.error(error);
                });
    };

    return (
        <div id={styles.auth}>
            <Head>
                <title>Register to Minroll</title>
            </Head>
            <form id={styles["auth-form"]} onSubmit={(e) => submitRegister(e)}>
                <h2 id={styles["form-header"]}>REGISTER</h2>
                <input
                    className={`${styles["form-input"]} ${
                        formErrors.email ? styles["error-input"] : ""
                    }`}
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={updateForm}
                />
                {formErrors.email ? (
                    <p className={styles["error-text"]}>{formErrors.email}</p>
                ) : (
                    ""
                )}
                <input
                    className={`${styles["form-input"]} ${
                        formErrors.username ? styles["error-input"] : ""
                    }`}
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={updateForm}
                    autoComplete="username"
                />
                {formErrors.username ? (
                    <p className={styles["error-text"]}>
                        {formErrors.username}
                    </p>
                ) : (
                    ""
                )}
                <input
                    className={`${styles["form-input"]} ${
                        formErrors.password ? styles["error-input"] : ""
                    }`}
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={updateForm}
                    autoComplete="current-password"
                />
                {formErrors.password ? (
                    <p className={styles["error-text"]}>
                        {formErrors.password}
                    </p>
                ) : (
                    ""
                )}
                <input
                    className={`${styles["form-input"]} ${
                        formErrors.confirmPassword ? styles["error-input"] : ""
                    }`}
                    placeholder="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={updateForm}
                    autoComplete="current-password"
                />
                {formErrors.confirmPassword ? (
                    <p className={styles["error-text"]}>
                        {formErrors.confirmPassword}
                    </p>
                ) : (
                    ""
                )}
                <input
                    id={styles["submit-button"]}
                    className={styles.active}
                    type="submit"
                    value="REGISTER"
                />
                {formErrors.form ? (
                    <p
                        className={styles["error-text"]}
                        style={{ textAlign: "center" }}
                    >
                        {formErrors.form}
                    </p>
                ) : (
                    ""
                )}
                <div id={styles["nav-links"]}>
                    <Link href="/login">
                        <a className={styles["nav-link"]}>GO TO LOGIN</a>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
