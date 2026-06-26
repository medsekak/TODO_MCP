import TodoBoard from "./pages/TodoBoard";
import TopBar from "./components/TopBar";

// Page board (la Navbar est fournie par le Layout parent).
const App = () => {
  return (
    <>
      <TopBar />
      <TodoBoard />
    </>
  );
};

export default App;
