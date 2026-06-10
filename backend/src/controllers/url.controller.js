import * as urlService from "../services/url.Service.js";

export const createUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.validatedData;

    const url = await urlService.createShortUrl(req.user.userId, originalUrl);
    return res.status(201).json({
      success: true,
      data: url,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyUrls = async (req, res, next) => {
  try {
    const urls = await urlService.getMyUrls(req.user.userId);

    return res.status(200).json({
      success: true,
      data: urls,
    });
  } catch (error) {
    next(error);
  }
};
