import { Card, CardContent, Avatar, Typography, Chip } from '@mui/material';

const UserCard = ({ user, postCount }) => {
  const randomAvatar = `https://i.pravatar.cc/150?img=${user.id % 70}`;
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={user.name} src={randomAvatar} sx={{ width: 56, height: 56, mr: 2 }} />
        <div>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {user.email}
          </Typography>
          <Chip label={`${postCount} posts`} color="secondary" />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;