import "./App.css";
import useAuth from "./hooks/useAuth";
import shuffleBackground from "./services/bg";
import Journals from "./views/Journals";

function App() {
    shuffleBackground();
    useAuth();

    return (
        <>
            <Journals />
        </>
    );
}

export default App;
