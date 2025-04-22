const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
    return false;
}

handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if(!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2});

    return false;
}

const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <div className='formBox'>
                <label htmlFor="username">Username: </label>
                <input type="text" name="username" id="user" placeholder="username" />
                <label htmlFor="pass">Password: </label>
                <input type="password" name="pass" id="pass" placeholder='password' />
                <input type="submit" className="formSubmit" value="Sign in" />
            </div>
        </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id='signupForm'sob
            name='signupForm'
            onSubmit={handleSignup}
            action='/signup'
            method='POST'
            className='mainForm'
        >
            <div className='formBox'>
                <label htmlFor="username">Username: </label>
                <input type="text" name="username" id="user" placeholder='username' />
                <label htmlFor="pass">Password: </label>
                <input type="password" name="pass" id="pass" placeholder='password' />
                <label htmlFor="pass">Password: </label>
                <input type="password" name="pass2" id="pass2" placeholder='retype password' />
                <input type="submit" className='formSubmit' value='Sign up' />
            </div>
        </form>
    );
};

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <LoginWindow /> );
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <SignupWindow />);
    });

    root.render( <LoginWindow /> );
};

window.onload = init;