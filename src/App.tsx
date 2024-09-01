import { Link, Route, Routes } from 'react-router-dom';
import GridGenerator from './pages/GridGenerator';
import PaymentsPage from './pages/PaymentsPage';

const App = () => {
  return (
    <>
      <div className="bg-gray-100  w-screen h-screen">
        <nav className="p-4 w-full overflow-hidden border-b-2 border-gray-500">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-gray-600 hover:text-gray-500">Grid Generator</Link>
            </li>
            <li>
              <Link to="/payments" className="text-gray-600 hover:text-gray-500">Payments</Link>
            </li>
          </ul>
        </nav>
        <div className="container mx-auto mt-4 px-4">
          <Routes>
            <Route path="/" element={<GridGenerator />} />
            <Route path="/payments" element={<PaymentsPage />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;