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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));

    const { urls, total } = await urlService.getMyUrls(
      req.user.userId,
      page,
      limit,
    );

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: urls,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
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

export const getQrCode = async (req, res, next) => {
  try {
    const qrBuffer = await urlService.generateQrCode(
      req.params.id,
      req.user.userId,
    );

    res.setHeader("Content-Type", "image/png");

    return res.send(qrBuffer);
  } catch (error) {
    next(error);
  }
};
