import type { RowDataPacket } from 'mysql2';
import pool from '../config/database';

export interface IPageVisit extends RowDataPacket {
  id: number;
  page_url: string;
  visitor_ip: string | null;
  user_agent: string | null;
  visited_at: Date;
}

export interface IPageVisitCreate {
  page_url: string;
  visitor_ip?: string;
  user_agent?: string;
}

export namespace PageVisit {
  export async function create(visitData: IPageVisitCreate): Promise<number> {
    try {
      const [result] = await pool.execute(
        'INSERT INTO page_visits (page_url, visitor_ip, user_agent) VALUES (?, ?, ?)',
        [visitData.page_url, visitData.visitor_ip || null, visitData.user_agent || null]
      );
      return (result as any).insertId;
    } catch (error) {
      console.error('Error creating page visit:', error);
      throw error;
    }
  }

  export async function getVisitStats(startDate: Date, endDate: Date): Promise<{
    totalVisits: number;
    uniqueVisitors: number;
    popularPages: Array<{ page_url: string; visits: number }>;
  }> {
    try {
      // Get total visits
      const [totalResult] = await pool.execute<any[]>(
        'SELECT COUNT(*) as total FROM page_visits WHERE visited_at BETWEEN ? AND ?',
        [startDate, endDate]
      );

      // Get unique visitors
      const [uniqueResult] = await pool.execute<any[]>(
        'SELECT COUNT(DISTINCT visitor_ip) as unique_visitors FROM page_visits WHERE visited_at BETWEEN ? AND ?',
        [startDate, endDate]
      );

      // Get popular pages
      const [popularPages] = await pool.execute<any[]>(
        `SELECT page_url, COUNT(*) as visits 
         FROM page_visits 
         WHERE visited_at BETWEEN ? AND ? 
         GROUP BY page_url 
         ORDER BY visits DESC 
         LIMIT 10`,
        [startDate, endDate]
      );

      return {
        totalVisits: totalResult[0].total || 0,
        uniqueVisitors: uniqueResult[0].unique_visitors || 0,
        popularPages: popularPages.map(page => ({
          page_url: page.page_url,
          visits: page.visits
        }))
      };
    } catch (error) {
      console.error('Error getting visit stats:', error);
      throw error;
    }
  }

  export async function getVisitsByTimeRange(startDate: Date, endDate: Date, interval: 'hour' | 'day' | 'month'): Promise<
    Array<{
      time_period: string;
      visits: number;
    }>
  > {
    try {
      let timeFormat: string;
      switch (interval) {
        case 'hour':
          timeFormat = '%Y-%m-%d %H:00:00';
          break;
        case 'day':
          timeFormat = '%Y-%m-%d';
          break;
        case 'month':
          timeFormat = '%Y-%m';
          break;
      }

      const [rows] = await pool.execute<any[]>(
        `SELECT DATE_FORMAT(visited_at, ?) as time_period, COUNT(*) as visits 
         FROM page_visits 
         WHERE visited_at BETWEEN ? AND ? 
         GROUP BY time_period 
         ORDER BY time_period`,
        [timeFormat, startDate, endDate]
      );

      return rows.map(row => ({
        time_period: row.time_period,
        visits: row.visits
      }));
    } catch (error) {
      console.error('Error getting visits by time range:', error);
      throw error;
    }
  }
} 