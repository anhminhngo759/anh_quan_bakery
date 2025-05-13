import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore - Suppress the declaration file error
import momoConfig from '../config/momo';
import type { 
  MomoPayload, 
  MomoCallbackResponse, 
  MomoReturnResponse,
  MomoConfig
} from '../types/momo';

interface OrderInfo {
  orderId: string;
  amount: number;
  orderInfo: string;
  extraData?: string;
}

// Get base URL from environment or use a fallback
const getBaseUrl = (): string => {
  return process.env.BASE_URL || 'http://localhost:3002';
};

// Ensure URL is absolute (has protocol and host)
const ensureAbsoluteUrl = (url: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${getBaseUrl()}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Generate HMAC SHA256 signature for MoMo request
 * @param payload The payload to sign
 * @returns Signature string
 */
const generateSignature = (payload: Record<string, string | number | boolean>): string => {
  // Build raw signature string based on MoMo's exact requirements
  // NOTE: Order of parameters matters for MoMo's signature validation
  const rawSignature = 
    `accessKey=${payload.accessKey}` +
    `&amount=${payload.amount}` +
    `&extraData=${payload.extraData}` +
    `&ipnUrl=${payload.ipnUrl}` +
    `&orderId=${payload.orderId}` +
    `&orderInfo=${payload.orderInfo}` +
    `&partnerCode=${payload.partnerCode}` +
    `&redirectUrl=${payload.redirectUrl}` +
    `&requestId=${payload.requestId}` +
    `&requestType=${payload.requestType}`;

  console.log('Raw signature string:', rawSignature);
  
  // Create HMAC SHA256 signature
  const signature = crypto
    .createHmac('sha256', momoConfig.secretKey)
    .update(rawSignature)
    .digest('hex');
  
  return signature;
};

/**
 * Create a payment request to MoMo
 * @param orderInfo Order information
 * @returns MoMo response data
 */
const createPayment = async (orderInfo: OrderInfo): Promise<MomoCallbackResponse> => {
  try {
    const requestId = uuidv4();
    
    // Ensure redirect and notification URLs are absolute
    const redirectUrl = ensureAbsoluteUrl(momoConfig.returnUrl);
    const ipnUrl = ensureAbsoluteUrl(momoConfig.notifyUrl);
    
    console.log('Redirect URL:', redirectUrl);
    console.log('IPN URL:', ipnUrl);
    
    // MoMo expects redirectUrl instead of returnUrl
    const payload: Record<string, string | number | boolean> = {
      partnerCode: momoConfig.partnerCode,
      accessKey: momoConfig.accessKey,
      requestId,
      amount: orderInfo.amount,
      orderId: orderInfo.orderId,
      orderInfo: orderInfo.orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: orderInfo.extraData || '',
      requestType: 'captureWallet',
      lang: 'vi'
    };

    // Add signature
    const signature = generateSignature(payload);
    const requestPayload = {
      ...payload,
      signature
    };

    console.log('MoMo request payload:', JSON.stringify(requestPayload, null, 2));

    // Send request to MoMo
    const response = await axios.post<MomoCallbackResponse>(
      `${momoConfig.apiUrl}${momoConfig.endpoints.create}`,
      requestPayload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('MoMo response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('MoMo API Error:', error.response?.data || error.message);
      throw new Error(`MoMo API Error: ${error.message}`);
    }
    console.error('MoMo Service Error:', error);
    throw new Error('Failed to create MoMo payment');
  }
};

/**
 * Verify callback data from MoMo
 */
const verifyCallback = (callbackData: MomoReturnResponse): boolean => {
  try {
    // Extract signature from callback data
    const { signature, ...payloadWithoutSignature } = callbackData;
    
    // Generate signature based on received data
    const generatedSignature = generateSignature(payloadWithoutSignature);
    
    // Compare generated signature with received signature
    return generatedSignature === signature;
  } catch (error) {
    console.error('MoMo Verification Error:', error);
    return false;
  }
};

/**
 * Query payment status
 */
const queryPayment = async (orderId: string, requestId: string): Promise<MomoCallbackResponse> => {
  try {
    const payload = {
      partnerCode: momoConfig.partnerCode,
      accessKey: momoConfig.accessKey,
      requestId: uuidv4(),
      orderId,
      lang: 'vi'
    };

    // Add signature
    const signature = generateSignature(payload);

    // Send request to MoMo
    const response = await axios.post<MomoCallbackResponse>(
      `${momoConfig.apiUrl}${momoConfig.endpoints.query}`,
      {
        ...payload,
        signature
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('MoMo API Error:', error.response?.data || error.message);
      throw new Error(`MoMo API Error: ${error.message}`);
    }
    console.error('MoMo Service Error:', error);
    throw new Error('Failed to query MoMo payment status');
  }
};

/**
 * Process a refund
 */
const refundPayment = async (
  orderId: string,
  transId: string,
  amount: number,
  description: string
): Promise<MomoCallbackResponse> => {
  try {
    const requestId = uuidv4();
    const payload = {
      partnerCode: momoConfig.partnerCode,
      accessKey: momoConfig.accessKey,
      requestId,
      amount,
      orderId: `refund_${orderId}_${requestId}`,
      transId,
      description
    };

    // Add signature
    const signature = generateSignature(payload);

    // Send request to MoMo
    const response = await axios.post<MomoCallbackResponse>(
      `${momoConfig.apiUrl}${momoConfig.endpoints.refund}`,
      {
        ...payload,
        signature
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('MoMo API Error:', error.response?.data || error.message);
      throw new Error(`MoMo API Error: ${error.message}`);
    }
    console.error('MoMo Service Error:', error);
    throw new Error('Failed to process MoMo refund');
  }
};

export default {
  createPayment,
  verifyCallback,
  queryPayment,
  refundPayment
}; 