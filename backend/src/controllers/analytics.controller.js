import * as analyticsService from "../services/analytics.service.js";

export const getUrlAnalytics = async (req, res, next) => {
  try {
    const { urlId } = req.params;

    const analytics = await analyticsService.getUrlAnalytics(urlId);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await analyticsService.getDashboardStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
