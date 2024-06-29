
import './App.css';
import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <AppRouter />
    </>
  );
}

export default App;
