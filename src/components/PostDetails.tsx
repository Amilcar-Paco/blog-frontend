import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import { Post } from "./Main";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  body: string;
  parent_comment_id?: number; // Make parent_comment_id optional
  created_at: Date;
  replies?: Comment[]; // Add replies field to hold child comments
}

const PostDetails = () => {
  const location = useLocation();
  const [post, setPost] = useState<Post>(location.state.post);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get<Comment[]>(
        `http://localhost:8080/api/comment.php?post_id=${post.id}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/api/comment.php", {
        post_id: post.id,
        user_id: 2, // Assuming a hardcoded user ID for now
        body: newComment,
      });
      fetchComments(); // Refresh comments after adding new one
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleReplySubmit = async (parentCommentId: number) => {
    try {
      await axios.post("http://localhost:8080/api/comment.php", {
        post_id: post.id,
        user_id: 2, // Assuming a hardcoded user ID for now
        body: newComment,
        parent_comment_id: parentCommentId, // Include the parent comment ID
      });
      fetchComments(); // Refresh comments after adding new reply
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const renderComments = (comments: Comment[]) => {
    return comments.map((comment) => (
      <div key={comment.id}>
        <Typography variant="body2" paragraph>
          {comment.body}
        </Typography>
        {comment.replies && renderComments(comment.replies)}{" "}
        {/* Recursively render replies */}
        {!comment.parent_comment_id && ( // Exclude comments with parent_comment_id
          <div>
            <TextField
              fullWidth
              label="Resposta"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => handleReplySubmit(comment.id)}
            >
              Responder
            </Button>
            <Divider style={{ margin: "12px 0" }} />
          </div>
        )}
      </div>
    ));
  };

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
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              marginBottom: "16px",
            }}
          />
        )}
        <Typography variant="body1" paragraph>
          {post.body}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Criado em: {new Date(post.created_at).toLocaleString()}
        </Typography>
      </Paper>
      <Typography variant="h5" gutterBottom mt={3}>
        Comentários
      </Typography>
      <Paper sx={{ padding: 2, marginTop: 2 }}>
        {renderComments(comments)}
      </Paper>
      <Typography variant="h6" mt={3}>
        Adicionar Comentário
      </Typography>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={9}>
          <TextField
            fullWidth
            label="Seu comentário"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" onClick={handleCommentSubmit}>
            Enviar
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PostDetails;
