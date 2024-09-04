import "./App.css";
import useAuth from "./hooks/useAuth";
import services from "./services";
import Journals from "./components/Journals";

function App() {
    services.bg.shuffleBackground();
    useAuth();

    return (
        <>
            <Journals />
        </>
    );
}

export default App;
