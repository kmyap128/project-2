const React = require('react');

const {createRoot} = require('react-dom/client');


const About = () => {
    return (
      <div className="aboutPage">
        <img id='aboutImg' src="/assets/img/domoface.jpeg" alt="Domo Face" />
        <div id='aboutText'>
            <h1>About Domomaker</h1>
            <h2>Build your team of Domo friends!</h2>

            <br />

            <p>This app lets you create and manage your Domos, each with a name, age, and level.</p>
            <p>Built with React, Node.js, Express, and MongoDB.</p>
        </div>
      </div>
    );
  };
  
  const init = () => {
      const root = createRoot(document.getElementById('aboutContent'));
      root.render( <About />);
  };

  window.onload = init;