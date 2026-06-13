import * as urlRepository from "../repositories/url.repository.js";
import { deleteCache } from "../cache/redisCache.js";
import logger from "../utils/logger.js";

const deleteExpiredUrlsJob = async () => {
  try {
    const expiredUrls = await urlRepository.findExpiredUrls();

    if (expiredUrls.length === 0) {
      logger.info({
        event: "EXPIRED_URL_CLEANUP",
        deletedCount: 0,
      });

      return;
    }

    for (const url of expiredUrls) {
      await deleteCache(`url:${url.shortCode}`);
    }

    await urlRepository.deleteManyUrls(expiredUrls.map((url) => url._id));

    logger.info({
      event: "EXPIRED_URL_CLEANUP",
      deletedCount: expiredUrls.length,
    });
  } catch (error) {
    logger.error({
      event: "EXPIRED_URL_CLEANUP_FAILED",
      message: error.message,
    });
  }
};

export default deleteExpiredUrlsJob;
