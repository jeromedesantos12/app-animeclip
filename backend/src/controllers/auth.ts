import { Request, Response, NextFunction } from "express";
import { google } from "googleapis";
import { prisma } from "../connections/prisma";
import { appError } from "../utils/error";
import { signToken } from "../utils/jwt";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { authrizationUrl, oauth2Client } from "../utils/google";

const WHERE_CLAUSE: any = {
  deleted_at: null,
};
const USER_SELECT_FIELDS = {
  id: true,
  username: true,
  fullname: true,
  email: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
};

export function googleAuth(req: Request, res: Response, next: NextFunction) {
  res.redirect(authrizationUrl);
}

export async function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code as string);
  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });
  const { data } = await oauth2.userinfo.get();
  if (
    data.email === undefined ||
    data.name === undefined ||
    data.picture === undefined
  ) {
    throw appError("Invalid credentials", 401);
  }
  WHERE_CLAUSE.email = data.email;
  let user = await prisma.user.findUnique({
    where: WHERE_CLAUSE,
  });
  if (user === null) {
    user = await prisma.user.create({
      data: {
        fullname: data.name as string,
        username: (data.email as string).split("@")[0] as string,
        email: data.email as string,
        avatar_url: data.picture,
        password: "",
        provider: "GOOGLE",
      },
    });
  }
  const token = signToken({
    id: user.id,
    username: user.username,
  });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
      path: "/",
    })
    .redirect("http://localhost:8080/");
}

export async function loginAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { emailOrUsername, password } = req.body;
    WHERE_CLAUSE.provider = "EMAIL";
    WHERE_CLAUSE.OR = [
      { email: emailOrUsername },
      { username: emailOrUsername },
    ];
    const user = await prisma.user.findFirst({
      where: WHERE_CLAUSE,
    });
    if (user === null) {
      throw appError("Invalid email or username", 401);
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (user && isPasswordValid === false) {
      throw appError("Invalid password", 401);
    }
    const token = signToken({
      id: user.id,
      username: user.username,
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
        path: "/",
      })
      .status(200)
      .json({
        status: "Success",
        message: "Login success!",
      });
  } catch (err) {
    next(err);
  }
}

export function logoutAuth(req: Request, res: Response, next: NextFunction) {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      .status(200)
      .json({
        status: "Success",
        message: "Logout success!",
      });
  } catch (err) {
    next(err);
  }
}

export async function registerAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { fullname, username, email, password } = req.body;
    WHERE_CLAUSE.OR = [{ email: email }, { username: username }];
    const hashedPassword = await hashPassword(password);
    const existingUser = await prisma.user.findFirst({
      where: WHERE_CLAUSE,
    });
    if (existingUser) {
      if (existingUser.username === username) {
        throw appError("Username already taken", 409);
      } else if (existingUser.email === email) {
        throw appError("Email already registered", 409);
      }
    }
    const dataToCreate: any = {
      fullname,
      username,
      email,
      password: hashedPassword,
    };
    const create = await prisma.user.create({
      data: dataToCreate,
    });
    delete WHERE_CLAUSE.OR;
    WHERE_CLAUSE.id = create.id;
    const register = await prisma.user.findUnique({
      select: USER_SELECT_FIELDS,
      where: WHERE_CLAUSE,
    });
    res.status(201).json({
      status: "Success",
      message: "Register success!",
      data: register,
    });
  } catch (err) {
    next(err);
  }
}

export function verifyAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    res.status(200).json({
      status: "Success",
      message: "Verify success!",
      data: {
        id: userId,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function resetAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    WHERE_CLAUSE.id = id;
    const { password, newPassword } = req.body;
    const existingUser = (req as any).model;
    const isPasswordValid = await comparePassword(
      password,
      existingUser.password
    );
    if (existingUser && isPasswordValid === false) {
      throw appError("Invalid password", 401);
    }
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: WHERE_CLAUSE,
    });
    res.status(200).json({
      status: "Success",
      message: `Reset password success!`,
    });
  } catch (err) {
    next(err);
  }
}
