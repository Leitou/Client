import React from "react";
import { Redirect } from "react-router-dom";

/**
 *
 * Another way to export directly your functional component.
 */
// if a user has not already logged in (localStorage would contain token
    // he has to log in first
export const RegisterGuard = props => {
        console.log("register guard has no token: "+!localStorage.getItem("token"));
        if (!localStorage.getItem("token")) {
            // console.log(props);
            // console.log(props.children);
            return props.children;
        }
        // if user is already logged in, redirects to the main /app
        console.log("user is already registered &logged in, redirecting to /game");
        return <Redirect to={"/game"} />;
    };
