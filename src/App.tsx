import GridGenerator from './components/GridGenerator';

const App = () => {
  return (
    <>
      <div className="w-screen flex flex-col min-h-screen bg-gray-100 p-4">
        <p className="text-gray-500">Character</p>
        <input type="text" className="border border-gray-300 p-2 mb-4 bg-white w-44" />
        <GridGenerator />
      </div>
    </>
  );
};

export default App;