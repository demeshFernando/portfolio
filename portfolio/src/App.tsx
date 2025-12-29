import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './content/home/Home';
import { BaseContextProvider } from './components/utils/mainContext';
import DbHomeUi from './content/database_UI/DB_Home';

function App() {
  return (
    <BaseContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:sourceId' element={<Home />} />
          <Route path='/accessDB' element={<DbHomeUi />} />
        </Routes>
      </BrowserRouter>
    </BaseContextProvider>
  );
}

export default App;
