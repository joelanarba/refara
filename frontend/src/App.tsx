import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Refara</h1>
      <p>Maternal Referral Management and Tracking System</p>
      <p style={{ color: '#666' }}>Application scaffold ready. Start building features!</p>
    </div>
  );
}

export default App;
