import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import PostCard from '../components/PostCard';
import { fetchAllPosts as fetchPosts, fetchComments } from '../services/api';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});

  useEffect(() => {
    let isMounted = true; // Prevent memory leaks

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const posts = await fetchPosts();

        // Fetch all comments in parallel
        const commentsData = await Promise.all(
          posts.map(post => fetchComments(post.id))
        );

        // Store comment counts
        const counts = posts.reduce((acc, post, index) => {
          acc[post.id] = commentsData[index].length;
          return acc;
        }, {});

        if (isMounted) {
          setCommentCounts(counts);

          // Find max comment count safely
          const maxCount = Math.max(0, ...Object.values(counts));

          // Filter trending posts with the highest comments
          const trending = posts.filter(post => counts[post.id] === maxCount);
          setTrendingPosts(trending);
        }
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        if (isMounted) setError('Failed to load trending posts. Please try again.');
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
        Trending Posts (Most Comments)
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {trendingPosts.length > 0 ? (
        trendingPosts.map(post => (
          <PostCard key={post.id} post={post} commentCount={commentCounts[post.id]} />
        ))
      ) : (
        <Typography>No trending posts found.</Typography>
      )}
    </div>
  );
};

export default TrendingPosts;
