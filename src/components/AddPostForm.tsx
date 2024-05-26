import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { MenuItem } from "@mui/material";
import { Post } from "./Main";

interface AddPostFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Category {
    id: number;
    name: string;
}

export default function AddPostForm({ open, setOpen }: AddPostFormProps) {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>("http://localhost:8080/api/category.php");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson: any = Object.fromEntries(formData.entries());

    try {
      // Add the selected category ID to the form data
      formJson.category_id = selectedCategory;
      const response = await axios.post<Post>("http://localhost:8080/api/post.php/2", formJson);
      const newPost: Post = response.data;
      console.log("Post added successfully:", newPost);
    } catch (error) {
      console.error("Error adding post:", error);
    }

    handleClose();
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCategory(event.target.value as number);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Adicionar Post
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Adicionar Artigo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="body"
            name="body"
            label="Body"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={5}
          />
          <TextField
            select
            fullWidth
            margin="dense"
            id="category"
            name="category_id"
            label="Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="standard"
            required
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Adicionar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
