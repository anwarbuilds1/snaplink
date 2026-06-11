import * as urlService from "../services/url.Service.js";

export const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.validatedData;

    const url = await urlService.createShortUrl(
      req.user.userId,
      originalUrl,
      customAlias,
      expiresAt,
    );

    return res.status(201).json({
      success: true,
      data: url,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUrl = async (req, res, next) => {
  try {
    const updatedUrl = await urlService.updateUrl(
      req.params.id,
      req.user.userId,
      req.validatedData.originalUrl,
    );

    return res.status(200).json({
      success: true,
      data: updatedUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    await urlService.deleteUrl(req.params.id, req.user.userId);

    return res.status(200).json({
      success: true,
      message: "URL deleted successfully",
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

export const getUrlById = async (req, res, next) => {
  try {
    const url = await urlService.getUrlById(req.params.id, req.user.userId);

    return res.status(200).json({
      success: true,
      data: url,
    });
  } catch (error) {
    next(error);
  }
};
