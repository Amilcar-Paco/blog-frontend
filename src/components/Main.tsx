// Main.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import AddPostForm from "./AddPostForm";
import { useNavigate } from "react-router-dom";

export interface Post {
  id: number;
  user_id: number;
  category_id: number;
  title: string;
  body: string;
  created_at: Date;
}

export interface AddPost {
  title: string;
  body: string;
  category_id: number;
}

const Main: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>(
          "http://localhost:8080/api/post.php"
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handlePostClick = (post: Post) => {
    navigate("/posts", { state: { post } }); // Pass the entire post object as state
  };


  return (
    <Container maxWidth="lg" className="mt-12">
      <AddPostForm open={open} setOpen={setOpen} />
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item key={post.id} xs={12} sm={6} md={4}>
            <Card 
            onClick={() => handlePostClick(post)}
            style={{ cursor: "pointer" }}
            variant="outlined">
              <CardContent style={{ height: "150px", overflow: "hidden" }}>
                <Typography variant="h5" component="div" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {post.body.length > 150
                    ? `${post.body.substring(0, 150)}...`
                    : post.body}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  component="p"
                >
                  Criado em: {post.created_at?.toString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Main;
