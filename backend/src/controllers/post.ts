import { Request, Response, NextFunction } from "express";
import { generateContent } from "../utils/gemini";
import { appError } from "../utils/error";

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const imageFile = (req as any)?.processedFiles?.image_url;
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
    res.status(201).json({
      status: "Success",
      message: "Post created successfully",
      data: parsedAiResponse,
    });
  } catch (err) {
    next(err);
  }
}
