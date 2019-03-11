import React from "react";
import {getDomain} from "../../helpers/getDomain";
import {Spinner} from "../../views/design/Spinner";
import {Button} from "../../views/design/Button";
import styled from "styled-components";
import {BaseContainer} from "../../helpers/layout";
import NavLink from "react-router-dom/es/NavLink";


const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export class Profile extends React.Component {
    state = {
        user: null,
        uName: null,
        bDate: null,
        didUpdate: false
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
                console.log("Profile response to fetch profile GET: "+response);
                if (response.status === 404){
                    console.log("Profile GET response.status: "+response.status);
                    throw response;
                }
                return response.json();
            })
            .then(async user => {
                console.log("Profile GET request (db findById()) user:\n"+user.name+user.username+user.birthDate+user.creationDate);
                // delays continuous execution of an async operation for 0.8 seconds.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                //await new Promise(resolve => setTimeout(resolve, 800));
                this.setState({ user, uName:user.username, bDate:user.birthDate });
            })
            .catch(err => {
                console.log(err);
                if (err.status === 404){
                    alert("This user does not exist");
                    this.props.history.push("/game");
                } else {
                    alert("Something went wrong fetching the users: " + err);
                }
            });
    }

    edit(){
        console.log("Profile editing "+ `${getDomain()}/users/${this.state.user.id}`);
        fetch(`${getDomain()}/users/${this.state.user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            // serialize data into a json string
            body: JSON.stringify({
                username: this.state.uName,
                birthDate: this.state.bDate,
                token: this.state.user.token,
            })

        })
            .then(response => {
                console.log("Profile PUT response: "+response);
                if (response.status !== 204){
                    console.log("Profile PUT response.status: "+response.status);
                    throw response;
                } else {
                    console.log("Profile of user gets updated! "+response.status);
                    this.componentDidMount();
                    // this.setState({didUpdate: true});
                    // this.props.history.push(`/game/profile/${this.state.user.id}`)
                }
            })
            // .then(async user => {
            //     console.log("Profile PUT request findById() user:"+user.name+user.username+user.birthDate+user.creationDate);
            //     // delays continuous execution of an async operation for 0.8 seconds.
            //     // This is just a fake async call, so that the spinner can be displayed
            //     // feel free to remove it :)
            //     //await new Promise(resolve => setTimeout(resolve, 800));
            //     this.setState({ user });
            // })
            .catch(err => {
                console.log(err);
                if (err.status === 404){
                    alert("User not found");
                    this.props.history.push("/game");
                } else {
                    alert("Something went wrong fetching the users: " + err);
                }
            });
    }

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    render (){
        console.log("Profile renders");
        return (
                <div>
                <h2>Profile</h2>
                {!this.state.user && this.state.didUpdate === false ? (
                    <div>
                        <p>Get user data from secure end point:</p>
                        <Spinner />
                    </div>
                ) : (
                    <div>
                        Name:<br/>{this.state.user.name}<br/>
                        Date of registration:<br/>{this.state.user.creationDate}<br/>
                        Status:<br/>{this.state.user.status}<br/>
                        {(this.state.user.token === localStorage.getItem("token")) ? (
                            <div>
                                {console.log("uName: "+ this.state.uName+" user.username: "+ this.state.user.username)}
                                <p>You may edit your username and password below<br/>
                                Placeholders correspond to the current profile data
                                    birth {" "+this.state.user.birthDate+" "+this.state.bDate}<br/>
                                    username {" "+this.state.user.username+" "+this.state.uName}
                                </p><br/>
                            <Label>Username</Label><br/>
                            <InputField
                                placeholder={this.state.uName}
                                onChange={e => {
                                    this.handleInputChange("uName", e.target.value);
                                }}
                            /><br/>
                            <Label>Birthdate</Label><br/>
                            <InputField
                                placeholder={this.state.bDate}
                                onChange={e => {
                                    this.handleInputChange("bDate", e.target.value);
                                }}
                            />
                                <ButtonContainer>

                                    <Button
                                        disabled={!this.state.uName || !this.state.bDate}
                                        width="50%"
                                        onClick={() => {
                                            this.edit();
                                        }}
                                    >
                                        Edit
                                    </Button>

                                </ButtonContainer>
                            </div>
                        ): (
                            <div>
                                Birthdate:<br/>{this.state.user.birthDate}<br/>
                                Username:<br/>{this.state.user.username}<br/>
                            </div>
                            )
                        }
                    </div>
                )}
                </div>
                )}
}
