import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './content/home/Home';
import { BaseContextProvider } from './components/utils/mainContext';

function App() {
  return (
    <BaseContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:sourceId' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </BaseContextProvider>
  );
}

export default App;
