import { resolve } from "path";
import { rename, unlink, writeFile } from "fs/promises";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/prisma";
import { USER_SELECT_FIELDS } from "../utils/schema";

export async function getUsers(
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
    const where: any = { deleted_at: null };
    if (search) {
      where.OR = [
        {
          username: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          fullname: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ];
    }
    const users = await prisma.user.findMany({
      where,
      select: USER_SELECT_FIELDS,
      take: limit,
      skip,
      orderBy: {
        [sort]: order,
      },
    });
    const total = await prisma.user.count({ where });
    res.status(200).json({
      status: "Success",
      message: "Fetch users success!",
      data: users,
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

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  try {
    const where: any = { id, deleted_at: null };
    const user = await prisma.user.findUnique({
      select: USER_SELECT_FIELDS,
      where,
    });
    res.status(200).json({
      status: "Success",
      message: "Fetch user success!",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const where: any = { id, deleted_at: null };
  const {
    remove_avatar,
    remove_banner,
    fullname,
    username,
    email,
    bio,
    headline,
  } = req.body;
  const model = (req as any).model;
  const processedFiles = (req as any).processedFiles || {};
  const oldAvatarName = model?.avatar_url;
  const oldBannerName = model?.banner_url;
  const newAvatarFile = processedFiles?.avatar_url;
  const newBannerFile = processedFiles?.banner_url;
  const uploadsDir = resolve(process.cwd(), "uploads", "user");
  const oldAvatarPath = oldAvatarName
    ? resolve(uploadsDir, "avatar", oldAvatarName)
    : null;
  const oldBannerPath = oldBannerName
    ? resolve(uploadsDir, "banner", oldBannerName)
    : null;
  const newAvatarPath = newAvatarFile ? resolve(uploadsDir, "avatar", newAvatarFile.fileName) : null;
  const newBannerPath = newBannerFile ? resolve(uploadsDir, "banner", newBannerFile.fileName) : null;
  const dataToUpdate: Record<string, any> = {
    fullname,
    username,
    email,
    bio,
    headline,
  };
  try {
    if (newAvatarFile && newAvatarPath) {
      await writeFile(newAvatarPath, newAvatarFile.fileBuffer);
      dataToUpdate.avatar_url = newAvatarFile.fileName;
    } else if (remove_avatar === "ok") {
      dataToUpdate.avatar_url = null;
    }
    if (newBannerFile && newBannerPath) {
      await writeFile(newBannerPath, newBannerFile.fileBuffer);
      dataToUpdate.banner_url = newBannerFile.fileName;
    } else if (remove_banner === "ok") {
      dataToUpdate.banner_url = null;
    }
    await prisma.user.update({
      data: dataToUpdate,
      where,
    });
    const filesToDelete: string[] = [];
    if ((remove_avatar === "ok" || newAvatarFile) && oldAvatarPath) {
      filesToDelete.push(oldAvatarPath);
    }
    if ((remove_banner === "ok" || newBannerFile) && oldBannerPath) {
      filesToDelete.push(oldBannerPath);
    }
    await Promise.all(
      filesToDelete.map((file) => unlink(file).catch(() => {}))
    );
    const sanitizeUser = await prisma.user.findUnique({
      where,
      select: USER_SELECT_FIELDS,
    });
    res.status(200).json({
      status: "Success",
      message: "Update user success!",
      data: sanitizeUser,
    });
  } catch (err) {
    const rollbackPaths: string[] = [];
    if (newAvatarPath) rollbackPaths.push(newAvatarPath);
    if (newBannerPath) rollbackPaths.push(newBannerPath);
    await Promise.all(
      rollbackPaths.map((file) => unlink(file).catch(() => {}))
    );
    next(err);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const where: any = { id, deleted_at: null };
  const model = (req as any).model;
  const oldAvatarName = model?.avatar_url;
  const oldBannerName = model?.banner_url;
  const uploadsDir = resolve(process.cwd(), "uploads", "user");
  const tempTimestamp = Date.now();
  let updatedData: Record<string, any> = {
    deleted_at: new Date(),
  };
  try {
    if (oldAvatarName && !oldAvatarName.startsWith("temp_")) {
      const oldPath = resolve(uploadsDir, "avatar", oldAvatarName);
      const newName = `temp_${tempTimestamp}_${oldAvatarName}`;
      const newPath = resolve(uploadsDir, "avatar", `temp_${oldAvatarName}`);
      await rename(oldPath, newPath).catch(() => {});
      updatedData.avatar_url = newName;
    }
    if (oldBannerName && !oldBannerName.startsWith("temp_")) {
      const oldPath = resolve(uploadsDir, "banner", oldBannerName);
      const newName = `temp_${oldBannerName}`;
      const newPath = resolve(uploadsDir, "banner", `temp_${oldBannerName}`);
      await rename(oldPath, newPath).catch(() => {});
      updatedData.banner_url = newName;
    }
    const deletedUser = await prisma.user.update({
      where,
      data: updatedData,
    });
    res.status(200).json({
      status: "Success",
      message: "User soft deleted successfully!",
      data: deletedUser,
    });
  } catch (err) {
    next(err);
  }
}

export async function restoreUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const where: any = { id, deleted_at: { not: null } };
  const model = (req as any).model;
  const oldAvatarName = model?.avatar_url;
  const oldBannerName = model?.banner_url;
  const uploadsDir = resolve(process.cwd(), "uploads", "user");
  try {
    let updatedData: Record<string, any> = {
      deleted_at: null,
    };
    if (oldAvatarName?.startsWith("temp_")) {
      const oldPath = resolve(uploadsDir, "avatar", oldAvatarName);
      const newName = oldAvatarName.replace(/^temp_/, "");
      const newPath = resolve(uploadsDir, "avatar", newName);
      await rename(oldPath, newPath).catch(() => {});
      updatedData.avatar_url = newName;
    }
    if (oldBannerName?.startsWith("temp_")) {
      const oldPath = resolve(uploadsDir, "banner", oldBannerName);
      const newName = oldBannerName.replace(/^temp_/, "");
      const newPath = resolve(uploadsDir, "banner", newName);
      await rename(oldPath, newPath).catch(() => {});
      updatedData.banner_url = newName;
    }
    const restoredUser = await prisma.user.update({
      where,
      data: updatedData,
    });
    res.status(200).json({
      status: "Success",
      message: "User restored successfully!",
      data: restoredUser,
    });
  } catch (err) {
    next(err);
  }
}