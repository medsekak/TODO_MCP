import TodoBoard from "./pages/TodoBoard";
import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Navbar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <TodoBoard />
      </div>
    </div>
  );
};

export default App;
