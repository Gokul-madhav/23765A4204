import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import UserCard from '../components/UserCard';
import { fetchUsers, fetchAllPosts as fetchPosts } from '../services/api';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Prevent memory leaks

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [users, allPosts] = await Promise.all([fetchUsers(), fetchPosts()]);

        // Count posts per user
        const userPostCounts = allPosts.reduce((acc, post) => {
          acc[post.userId] = (acc[post.userId] || 0) + 1;
          return acc;
        }, {});

        // Get top 5 users sorted by post count
        const sortedUsers = users
          .map(user => ({
            ...user,
            postCount: userPostCounts[user.id] || 0
          }))
          .sort((a, b) => b.postCount - a.postCount)
          .slice(0, 5);

        if (isMounted) setTopUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching top users:', error);
        if (isMounted) setError('Failed to load user data. Please try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Top Users by Post Count
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {topUsers.length > 0 ? (
        topUsers.map(user => <UserCard key={user.id} user={user} postCount={user.postCount} />)
      ) : (
        <Typography>No users found.</Typography>
      )}
    </div>
  );
};

export default TopUsers;
