import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import Game from "../../game/Game";
import {GameGuard} from "../routeProtectors/GameGuard";
import {getDomain} from "../../../helpers/getDomain";
import {Spinner} from "../../../views/design/Spinner";
import {Button} from "../../../views/design/Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class GameRouter extends React.Component {
  render() {
      console.log("GameRouter props.base: "+this.props.base);
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
      <Container>
        <Route
            path='/game/profile/:id'
            component={Profile}
        />
        <Route
          exact
          path={`${this.props.base}/dashboard`}
          render={() => <Game />}
        />
        <Route
          exact
          path={`${this.props.base}`}
          render={() => <Redirect to={`${this.props.base}/dashboard`} />}
        />
      </Container>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default GameRouter;


class Profile extends React.Component {
    state = {
        user: null
    }

    componentDidMount() {
        const { id } = this.props.match.params
        console.log("Profile did mount, id: "+id);
        fetch(`${getDomain()}/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                console.log(response);
                if (response.status == 404){
                    console.log("GameRouter fetch Profile response.status: "+response.status);
                    throw response;
                }
                return response.json();
            })
            .then(async user => {
                console.log("Profile GET request findById() user:"+user.name+user.username+user.birthDate+user.creationDate);
                // delays continuous execution of an async operation for 0.8 seconds.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                //await new Promise(resolve => setTimeout(resolve, 800));
                this.setState({ user });
            })
            .catch(err => {
                console.log(err);
                if (err.status == 404){
                    alert("This user does not exist");
                    this.props.history.push("/game");
                } else {
                    alert("Something went wrong fetching the users: " + err);
                }
            });
    }
    render (){
        console.log("Profile renders");
        return (

            <Container>
                <h2>Happy Coding! </h2>
                <p>Get user with  from secure end point:</p>
                {!this.state.user ? (
                    <Spinner />
                ) : (
                    <div>
                        Username:<br/>{this.state.user.username}<br/>
                        Name:<br/>{this.state.user.name}<br/>
                        Birthdate:<br/>{this.state.user.birthDate}<br/>
                        Date of registration:<br/>{this.state.user.creationDate}<br/>
                    </div>
                )}
            </Container>)
    }
}