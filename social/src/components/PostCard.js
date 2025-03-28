import { Card, CardContent, CardMedia, Typography, Avatar, Chip, Stack } from '@mui/material';
import { useState, useEffect } from 'react';

const PostCard = ({ post, commentCount }) => {
  const [user, setUser] = useState(null);
  const randomImage = `https://picsum.photos/600/400?random=${post.id}`;
  const randomAvatar = `https://i.pravatar.cc/150?img=${post.userId % 70}`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [post.userId]);

  return (
    <Card sx={{ mb: 3 }}>
      <CardMedia
        component="img"
        height="300"
        image={randomImage}
        alt="Post image"
      />
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar alt={user?.name} src={randomAvatar} />
          <Typography variant="subtitle1">{user?.name || 'Loading...'}</Typography>
        </Stack>
        <Typography variant="h5" component="div" sx={{ mb: 1 }}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {post.body}
        </Typography>
        <Chip label={`${commentCount} comments`} color="primary" />
      </CardContent>
    </Card>
  );
};

export default PostCard;