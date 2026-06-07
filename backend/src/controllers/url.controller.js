import * as urlService from "../services/url.Service.js";

export const createUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;

    const url = await urlService.createShortUrl(originalUrl);
    return res.status(201).json({
      success: true,
      data: url,
    });
  } catch (error) {
    next(error);
  }
};
