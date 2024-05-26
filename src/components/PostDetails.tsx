import React from "react";
import { Typography, Container, Paper } from "@mui/material";
import { Post } from "./Main";
import { useLocation } from "react-router-dom";

export interface PostDetailsProps {
  post: Post;
}

const PostDetails = () => {
  const location = useLocation();
  const post: Post = location.state.post;
  if (!post) {
    // Handle case where post is null or undefined
    return <div>No post found</div>;
  }

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {post.body}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Criado em: {new Date(post.created_at).toLocaleString()}
        </Typography>
      </Paper>
    </Container>
  );
};

export default PostDetails;
