import prisma from "../prisma/prismaClient.js";

async function getPosts(req, res) {
  try {
    const posts =
      req.user.role.toLowerCase() === "admin"
        ? await prisma.post.findMany()
        : await prisma.post.findMany({
            where: {
              published: true,
            },
          });
    res.status(200).json(posts);
  } catch (err) {
    return res.status(400).json({ error: "Cannot get posts" });
  } finally {
    await prisma.$disconnect();
  }
}

async function getPost(req, res) {
  const { postId } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(postId),
      },
    });
    return res.status(200).json(post);
  } catch (err) {
    return res.status(400).json({ error: "Cannot get post" });
  } finally {
    await prisma.$disconnect();
  }
}

async function createPost(req, res) {
  const { title, content } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.user.id,
      },
    });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).json({ error: "Cannot create post" });
  } finally {
    await prisma.$disconnect();
  }
}

async function deletePost(req, res) {
  const { postId } = req.params;
  try {
    const post = await prisma.post.delete({
      where: {
        id: parseInt(postId),
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Cannot find post" });
    } else {
      return res.status(200).json({ message: "Post deleted successfully" });
    }
  } catch (err) {
    return res.status(400).json({ error: "Cannot delete the post" });
  } finally {
    await prisma.$disconnect();
  }
}

async function updatePost(req, res) {
  const { title, content, published } = req.body;
  const { postId } = req.params;
  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(postId),
      },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(published && {
          published: published.toLowerCase() === "false" ? false : true,
        }),
      },
    });
    return res.status(200).json(post);
  } catch (err) {
    return res.status(400).json({ error: "Couldn't complete this operation" });
  } finally {
    await prisma.$disconnect();
  }
}

export { getPosts, createPost, deletePost, updatePost, getPost };
