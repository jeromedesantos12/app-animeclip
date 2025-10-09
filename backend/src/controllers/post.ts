import { resolve } from "path";
import { rename, writeFile } from "fs/promises";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/prisma";
import { generateContent } from "../utils/gemini";
import { appError } from "../utils/error";
import { POST_SELECT_FIELDS } from "../utils/schema";

export async function getPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    search = "",
    page = 1,
    limit = 10,
    sort = "created_at",
    order = "desc",
  }: {
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
  } = req.query;
  const skip = (page - 1) * limit;
  try {
    const logId = (req as any).user.id;
    const where: any = { deleted_at: null, created_by: logId };
    if (search) {
      where.OR = [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          summary: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ];
    }
    const posts = await prisma.post.findMany({
      where,
      select: POST_SELECT_FIELDS,
      take: limit,
      skip,
      orderBy: {
        [sort]: order,
      },
    });
    const total = await prisma.post.count({ where });
    res.status(200).json({
      status: "Success",
      message: "Fetch posts success!",
      data: posts,
      meta: {
        total,
        page,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getPostById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const logId = (req as any).user.id;
    const where: any = { id, deleted_at: null, created_by: logId };
    const post = await prisma.post.findUnique({
      select: POST_SELECT_FIELDS,
      where,
    });
    res.status(200).json({
      status: "Success",
      message: "Fetch post success!",
      data: post,
    });
  } catch (err) {
    next(err);
  }
}

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const imageFile = (req as any)?.processedFiles?.image_url;
  const uploadsDir = resolve(process.cwd(), "uploads", "post");
  const createdBy = (req as any).user.id;
  try {
    const aiResponse = await generateContent(
      imageFile.fileBuffer,
      imageFile.fileMimeType
    );
    const aiResponseContent =
      aiResponse?.candidates?.[0].content?.parts?.[0]?.text ?? "";
    if (aiResponseContent === undefined) {
      throw appError("AI returned an empty response.", 500);
    }
    const parsedAiResponse = JSON.parse(aiResponseContent);
    const dataToCreate: any = {
      title: parsedAiResponse.title,
      episode_no: parsedAiResponse.episode_no,
      episode_title: parsedAiResponse.episode_title,
      clip_time: parsedAiResponse.clip_time,
      summary: parsedAiResponse.summary,
      created_by: createdBy,
    };
    const imagePath = resolve(uploadsDir, "image", imageFile.fileName);
    await writeFile(imagePath, imageFile.fileBuffer);
    dataToCreate.image_url = imageFile.fileName;
    const createdPost = await prisma.post.create({
      data: dataToCreate,
      select: POST_SELECT_FIELDS,
    });
    res.status(201).json({
      status: "Success",
      message: "Post created successfully",
      data: createdPost,
    });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const logId = (req as any).user.id;
  const where: any = { id, deleted_at: null, created_by: logId };
  const model = (req as any).model;
  const oldImageName = model.image_url;
  const uploadsDir = resolve(process.cwd(), "uploads", "post");
  const tempTimestamp = Date.now();
  let updatedData: Record<string, any> = {
    deleted_at: new Date(),
    deleted_by: logId,
  };
  try {
    if (oldImageName && !oldImageName.startsWith("temp_")) {
      const oldPath = resolve(uploadsDir, "image", oldImageName);
      const newName = `temp_${tempTimestamp}_${oldImageName}`;
      const newPath = resolve(uploadsDir, "image", `temp_${oldImageName}`);
      await rename(oldPath, newPath).catch(() => {});
      updatedData.image_url = newName;
    }
    const deletedPost = await prisma.post.update({
      where,
      data: updatedData,
    });

    console.log(deletedPost.created_by);
    res.status(200).json({
      status: "Success",
      message: "Post soft deleted and file renamed for cleanup.",
      data: deletedPost,
    });
  } catch (err) {
    next(err);
  }
}

export async function restorePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const logId = (req as any).user.id;
  const where: any = { id, deleted_at: { not: null } };
  const model = (req as any).model;
  const oldImageName = model?.image_url;
  const uploadsDir = resolve(process.cwd(), "uploads", "post");
  try {
    let updatedData: Record<string, any> = {
      deleted_at: null,
      created_by: logId,
    };
    if (oldImageName?.startsWith("temp_")) {
      const oldPath = resolve(uploadsDir, oldImageName);
      const newName = oldImageName.replace(/^temp_/, "");
      const newPath = resolve(uploadsDir, "image", newName);
      await rename(oldPath, newPath).catch(() => {});
      updatedData.image_url = newName;
    }
    const restoredPost = await prisma.post.update({
      where,
      data: updatedData,
    });
    return res.status(200).json({
      status: "Success",
      message: "Post restored successfully!",
      data: restoredPost,
    });
  } catch (err) {
    next(err);
  }
}
