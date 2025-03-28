import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import PostCard from '../components/PostCard';
import { fetchAllPosts as fetchPosts, fetchComments } from '../services/api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});

  useEffect(() => {
    let isMounted = true; // Prevent memory leaks

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all posts
        const allPosts = await fetchPosts();
        const sortedPosts = allPosts.sort((a, b) => b.id - a.id);
        if (!isMounted) return;
        setPosts(sortedPosts);

        // Fetch all comments in parallel
        const commentsData = await Promise.all(
          sortedPosts.map(post => fetchComments(post.id))
        );

        // Store comment counts
        const counts = sortedPosts.reduce((acc, post, index) => {
          acc[post.id] = commentsData[index].length;
          return acc;
        }, {});

        if (isMounted) setCommentCounts(counts);
      } catch (error) {
        console.error('Error fetching feed data:', error);
        if (isMounted) setError('Failed to load posts. Please try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);

    return () => {
      clearInterval(intervalId);
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
        Latest Posts
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {posts.length > 0 ? (
        posts.map(post => (
          <PostCard key={post.id} post={post} commentCount={commentCounts[post.id] || 0} />
        ))
      ) : (
        <Typography>No posts found.</Typography>
      )}
    </div>
  );
};

export default Feed;
