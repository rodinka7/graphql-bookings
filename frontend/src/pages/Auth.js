import React, { Component } from 'react';
import AuthContext from '../context/auth';

import './Auth.css';

class AuthPage extends Component {
    state = {
        isLogin: true
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => ({
            isLogin: !prevState.isLogin
        }))
    };

    submitHandler = evt => {
        evt.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        if (!email.trim().length || !password.trim().length)
            return;

        const requestBody = this.state.isLogin ? {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        } : {
            query: `
                mutation CreateUser($email: String!, $password: String!) {
                    createUser(userInput: {
                        email: $email,
                        password: $password
                    }) {
                        _id
                        email
                    }
                }
            `
        };

        requestBody.variables = {
            email,
            password
        };

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201)
                throw new Error('Failed!!!');
            return res.json();
        })
        .then(respData => {
            const { token, tokenExpiration, userId } = respData.data.login;
            if (token)
                this.context.login({userId, token, tokenExpiration});
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" ref={this.emailEl} />
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl} />
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.switchModeHandler}>Submit to {this.state.isLogin ? 'SignUp' : 'Login'}</button>
                </div>
            </form>
        )
    }
}

export default AuthPage;