import express from "express";
import dotenv from "dotenv";
import { Blog } from "./blog.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { blogSchema, options, blogUpdateSchema } from "./validation.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 5000;
dotenv.config({ path: "./configenv.env" });
console.log(process.env.PORT);

const mongoURI = process.env.MONGODB_CONNECTION_URL;
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("connected to DB successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//CREATE BLOG POST
app.post("/api/create", async (req, res) => {
  const validate = blogSchema.validate(req.body, options);
  if (validate.error) {
    const message = validate.error.details
      .map((detail) => detail.message)
      .join(",");
    return res.status(400).json({
      status: "fail",
      message,
    });
  }
  const { title, message } = req.body;
  try {
    const blog = new Blog({
      title,
      message,
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET ALL BLOG POSTS
app.get("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.find();
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET A BLOG POST
app.get("/api/blog/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).send(err);
  }
});

//EDIT A BLOG POST
app.put("/api/edit/:id", async (req, res) => {
  const validate = blogUpdateSchema.validate(req.body, options);
  if (validate.error) {
    const message = validate.error.details
      .map((detail) => detail.message)
      .join(",");
    return res.status(400).json({
      status: "fail",
      message,
    });
  }
  const { id } = req.params;
  const { title, message } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(
      id,
      { title, message },
      { new: true }
    );
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).send(err);
  }
});

//DELETE A BLOG POST
app.delete("/api/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Blog.findByIdAndDelete(id);
    res.status(200).json("Blog Post Deleted Successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
