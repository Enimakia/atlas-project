import { Request, Response } from 'express';
import { db } from '../lib/db';

function extractPublicId(url: string): string | null {
  const regex = /\/([^\/]+)\.[a-zA-Z]+$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export const CreateContent = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization?.split(' ')[1];

    if (!auth) {
      return res
        .status(400)
        .json({ message: 'missing teacher authorization header' });
    }

    const findTeacher = await db.teacher.findUnique({
      where: {
        clerkId: auth,
      },
    });

    if (!findTeacher) {
      return res.status(400).json({ message: 'teacehr not found' });
    }

    const { topicId, content, contenttpye } = req.body;
    const contentToCreate: any = {};

    if (!topicId) {
      return res.status(400).json({ message: 'missing topic Id' });
    }

    if (
      !(await db.topic.findUnique({
        where: {
          id: topicId,
        },
      }))
    ) {
      return res
        .status(404)
        .json({ message: 'topic not found, provide a correct topic ID' });
    }

    contentToCreate[topicId] = topicId;

    if (contenttpye && contenttpye !== 'PDF') {
      contentToCreate[contenttpye] = contenttpye;
    }

    if (!content) {
      return res
        .status(400)
        .json({ message: 'file url missing, provide a url' });
    }

    if (!extractPublicId(content)) {
      return res.status(400).json({ message: 'invalid cloudinary url' });
    }

    contentToCreate[content] = content;

    const CreateContent = await db.topicContent.create({
      data: {
        ...contentToCreate,
      },
    });

    if (!CreateContent) {
      return res.status(500).json({ message: 'topic content not created' });
    }

    return res.status(200).json({
      message: 'topic content created successfully',
      data: CreateContent,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
