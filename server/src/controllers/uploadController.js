import { Readable } from 'stream';
import { cloudinary } from '../config/cloudinary.js';
import { config } from '../config/index.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * POST /api/upload/image
 * Expects req.file to be populated by multer memoryStorage uploadSingle.
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
      return errorResponse(
        res,
        'Cloudinary service is not configured. Please provide CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env',
        503
      );
    }

    if (!req.file) {
      return errorResponse(res, 'No file provided', 400);
    }

    const { buffer, mimetype } = req.file;

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'cms' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      Readable.from(buffer).pipe(uploadStream);
    });

    return successResponse(
      res,
      { url: result.secure_url, publicId: result.public_id },
      'Image uploaded successfully',
      201
    );
  } catch (err) {
    next(err);
  }
};
