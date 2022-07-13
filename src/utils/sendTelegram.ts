import FormData from "form-data";
import fs from "fs";
import { removeTags } from "./removeTags.js";
import fetch from "node-fetch";

export const sendTelegram = async ({
  message,
  medias,
}: {
  message: string;
  medias?: any[];
}) => {
  try {
    const formData = new FormData();
    formData.append(`message`, removeTags(message));
    formData.append(`telegramId`, process.env.TELEGRAM_ID as string);

    if (!medias) {
      await fetch(`${process.env.RES_LINK}/message`, {
        method: `POST`,
        body: formData as any,
      });
    }

    if (medias) {
      for (let i = 0; i < medias.length; i++) {
        formData.append(`medias`, fs.createReadStream(medias[i].path));
      }

      await fetch(`${process.env.RES_LINK}/medias`, {
        method: `POST`,
        body: formData as any,
        headers: {
          ...formData.getHeaders(),
        },
      });
    }

    return `Message sent`;
  } catch (error) {
    console.log(`error: `, error);

    return `Message could not be sent`;
  }
};
