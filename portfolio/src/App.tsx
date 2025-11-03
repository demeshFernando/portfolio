import MainHeader from './components/mainHeader/MainHeader';

function App() {
  return (
    <>
      <div style={{
        width: '100%',
        height: '500px'
      }}></div>
      <MainHeader />
      <div style={{
        width: '100%',
        height: '1000px',
        backgroundColor: 'red',
      }}>header</div>
    </>
  );
}

export default App;
