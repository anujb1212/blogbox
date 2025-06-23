import { SignupInput } from "@anujb_dev/blogbox-common";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface AuthProps {
    type: "signup" | "signin";
};

const Auth = (props: AuthProps) => {
    const { type } = props;
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    })

    async function authRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, credentials)
            const jwt = response.data.jwt
            localStorage.setItem("token", jwt)
            navigate("/blogs")
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(`Something went wrong: ${err.message}`);
            } else {
                alert("An unknown error occurred");
            }
        }
    }

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-4xl font-extrabold ">
                            {type === "signin" ? "Welcome Back!" : "Create an Account"}
                        </div>
                        <div className="text-slate-400 text-center m-3">
                            {type === "signin" ? "Don't have an account ?" : "Already have an Account ?"}
                            <Link className="p-2 text-blue-500 underline" to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Signup" : "Login"}
                            </Link>
                        </div>
                    </div>
                    {type === "signup" ? <InputBox label="Name" placeholder="Eg: Your Name" onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            name: e.target.value
                        })
                    }} /> : null}

                    <InputBox label="Username" placeholder="Eg: abc@email.com" onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            email: e.target.value
                        })
                    }} />
                    <InputBox label="Password" type={"password"} placeholder="•••••••••" onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            password: e.target.value
                        })
                    }} />
                    <button type="button" onClick={authRequest} className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                </div>
            </div>
        </div>
    )
}

interface InputBoxType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string
}

function InputBox({ label, placeholder, onChange, type }: InputBoxType) {
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}

export default Auth