import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Feed from './pages/Feed';
import TrendingPosts from './pages/TrendingPosts';
import TopUsers from './pages/TopUsers';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/trending" element={<TrendingPosts />} />
          <Route path="/top-users" element={<TopUsers />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;