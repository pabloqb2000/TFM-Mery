import './App.css'
import { Routes, Route } from "react-router-dom";
import UsersPage from './components/UsersPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </>
  );
}

export default App
