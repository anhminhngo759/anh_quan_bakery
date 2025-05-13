import type { Request, NextFunction } from 'express';
import { PageVisit } from '../models/PageVisit';

export const trackPageVisit = async (
  req: Request,
  next: NextFunction
): Promise<void> => {
  try {
    // Only track GET requests
    if (req.method === 'GET') {
      const visitData = {
        page_url: req.originalUrl,
        visitor_ip: req.ip,
        user_agent: req.headers['user-agent'] || undefined
      };

      // Don't await the creation to avoid slowing down the response
      PageVisit.create(visitData).catch(error => {
        console.error('Error tracking page visit:', error);
      });
    }
    next();
  } catch (error) {
    console.error('Error in page visit middleware:', error);
    next();
  }
}; 