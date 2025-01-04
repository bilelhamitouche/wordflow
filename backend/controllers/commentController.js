import prisma from "../prisma/prismaClient.js";

async function getComments(req, res) {
  const { postId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: parseInt(postId),
      },
    });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(400).json({ error: "Cannot get comments" });
  } finally {
    await prisma.$disconnect();
  }
}

async function createComment(req, res) {
  const { postId } = req.params;
  const { content } = req.body;
  const authorId = req.user.id;
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: parseInt(authorId),
        postId: parseInt(postId),
      },
    });
    return res.status(201).json(comment);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Post or Author cannot be found" });
    }
    return res.status(400).json({ error: "Cannot create comment" });
  } finally {
    await prisma.$disconnect();
  }
}

export { getComments, createComment };
