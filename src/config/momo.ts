/**
 * MoMo e-wallet payment configuration
 */
import type { MomoConfig, MomoEndpoints } from '../types/momo';

// Get host name, either from environment or default
const getHostUrl = (): string => {
  return process.env.HOST_URL || 'http://localhost:3002';
};

const momoConfig: MomoConfig = {
  // Common settings
  partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
  accessKey: process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85',
  secretKey: process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  apiUrl: process.env.MOMO_API_URL || 'https://test-payment.momo.vn',
  returnUrl: `${getHostUrl()}/payment/momo/return`,
  notifyUrl: `${getHostUrl()}/payment/momo/ipn`,
  isSandbox: process.env.MOMO_SANDBOX === 'true' || true,

  // MoMo API endpoints
  endpoints: {
    create: '/v2/gateway/api/create',
    confirm: '/v2/gateway/api/confirm',
    query: '/v2/gateway/api/query',
    refund: '/v2/gateway/api/refund'
  }
};

export default momoConfig; 