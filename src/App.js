import logo from './logo.svg';
import './App.css';
import TransactionReceipt from './TransactionReceipt.tsx';

function App() {
  return (
    <div className="App">
      <h1>RSK QR Generator</h1>
      <TransactionReceipt />
    </div>
  );
}

export default App;
