import { Response } from 'express';

export const successResponse = <T>(
  res: Response,
    payload: {
    statusCode?: number;
    data?: T;
    message?: string;
  },
) => {
 res.status(payload.statusCode || 200).json({
    success: true,
    data: payload.data,
    message: payload.message || "Successfull!",
  });
};

export const errorResponse = <T>(
  res: Response,
  payload: {
    statusCode?: number;
    message?: string;
  },
) => {
  res.status(payload.statusCode || 500).json({
    success: false,
    message: payload.message || 'Internal server error!',
  });
};
