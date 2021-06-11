import './App.css';
import Header from "./Header";
import {useState} from "react";
import LoginModal from "./LoginModal";
import {Modal} from "@material-ui/core";

function App() {
  const [login, setLogin] = useState(false);
  function openLoginModal() {
    setLogin(true);
  }

  function closeLoginModal() {
    setLogin(false);
  }

  return (
    <>
      <Modal
        open={login}
        onClose={closeLoginModal}
        aria-labelledby="Login Form"
        aria-describedby="Input your login details here"
      >
        <LoginModal/>
      </Modal>
      <Header handleLogin={openLoginModal}/>
      <div className="App">
        <h1>State Of The Art</h1>
        <h1>Automated</h1>
        <h1>Machine</h1>
        <h1>Learning</h1>
      </div>
    </>
  );
}

export default App;
