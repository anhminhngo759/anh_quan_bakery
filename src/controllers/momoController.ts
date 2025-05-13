import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore - Suppress the declaration file error
import momoService from '../services/momoService';
import type { MomoReturnResponse } from '../types/momo';
import { Order } from '../models/Order';

/**
 * Create a MoMo payment for a given order
 */
export const createMomoPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, amount, orderInfo } = req.body;

    if (!orderId) {
      res.status(400).json({ 
        success: false, 
        message: 'Missing order ID' 
      });
      return;
    }

    // Fetch order from database if amount not provided
    let orderAmount = amount;
    if (!orderAmount) {
      try {
        const order = await Order.findById(Number(orderId));
        if (order) {
          orderAmount = order.total_amount;
        } else {
          res.status(404).json({
            success: false,
            message: 'Order not found'
          });
          return;
        }
      } catch (dbError) {
        console.error('Error fetching order:', dbError);
        res.status(500).json({
          success: false,
          message: 'Error fetching order details'
        });
        return;
      }
    }

    // Create a MoMo payment with additional info
    const momoPayment = await momoService.createPayment({
      orderId: `${orderId}_${Date.now()}`, // Make orderId unique with timestamp
      amount: Number(orderAmount),
      orderInfo: orderInfo || `Thanh toán đơn hàng #${orderId} - Anh Quan Bakery`,
      extraData: Buffer.from(JSON.stringify({originalOrderId: orderId})).toString('base64') // Include original orderId in extraData
    });

    if (momoPayment.resultCode === 0) {
      res.status(200).json({
        success: true,
        paymentUrl: momoPayment.payUrl,
        message: 'MoMo payment created successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        code: momoPayment.resultCode,
        message: momoPayment.message || 'Failed to create MoMo payment'
      });
    }
  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the MoMo payment'
    });
  }
};

/**
 * Handle return URL from MoMo
 */
export const handleReturnUrl = async (req: Request, res: Response) => {
  console.log('=============================================');
  console.log(`MoMo return URL handler executing at: ${new Date().toISOString()}`);
  console.log(`- Query params: ${JSON.stringify(req.query)}`);
  console.log(`- Body: ${JSON.stringify(req.body)}`);
  console.log(`- Full URL: ${req.originalUrl}`);

  try {
    // Get MoMo order ID and result code from query or body
    let momoOrderId = req.query.orderId as string;
    if (!momoOrderId && req.body?.orderId) {
      momoOrderId = req.body.orderId;
    }
    
    let resultCode = req.query.resultCode as string;
    if (!resultCode && req.body?.resultCode) {
      resultCode = req.body.resultCode;
    }
    
    if (!momoOrderId) {
      console.error('No order ID found in MoMo response');
      return res.redirect('/gio-hang/checkout?error=missing_order_id');
    }
    
    if (!resultCode) {
      console.error('No result code found in MoMo response');
      return res.redirect('/gio-hang/checkout?error=missing_result_code');
    }
    
    console.log('Found order ID in query params:', momoOrderId);
    console.log('Found result code in query params:', resultCode);
    
    // Extract original order ID from the MoMo order ID
    const originalOrderId = momoOrderId.split('_')[0];
    console.log('Original order ID extracted:', originalOrderId);
    
    // Check if payment was successful
    const resultCodeStr = String(resultCode);
    const isSuccess = resultCodeStr === '0' || resultCodeStr === '00';
    console.log('Payment success status:', isSuccess, 'Result code:', resultCode);
    
    // Process based on payment status
    if (isSuccess) {
      try {
        const order = await Order.findById(Number(originalOrderId));
        console.log('Order lookup result:', order ? 'Found' : 'Not found');
        
        if (order) {
          try {
            // Update order payment method
            // @ts-ignore - Suppress type errors with database model
            await Order.update({
              payment_method: 'momo',
              notes: 'Thanh toán MoMo thành công'
            }, Number(originalOrderId));
            
            // Then update status to confirmed - this will trigger stock reduction
            const statusUpdated = await Order.updateStatus(Number(originalOrderId), 'confirmed');
            
            if (statusUpdated) {
              console.log('Order status updated to CONFIRMED and stock reduced');
            } else {
              console.error('Failed to update order status');
            }
          } catch (error) {
            console.error('Error updating order:', error);
          }
        }
      } catch (error) {
        console.error('Error finding order:', error);
      }
      
      // Direct redirect to the order confirmation page
      const confirmationUrl = `/gio-hang/order-confirmation/${originalOrderId}`;
      console.log('SUCCESS: Redirecting to:', confirmationUrl);
      return res.redirect(confirmationUrl);
    }

    // If we get here, payment failed or was canceled
    try {
      const order = await Order.findById(Number(originalOrderId));
      if (order) {
        // Update payment method and notes
        // @ts-ignore - Suppress type errors with database model
        await Order.update({
          payment_method: 'momo',
          notes: `Thanh toán thất bại: ${req.query.message || 'Không rõ lý do'}`
        }, Number(originalOrderId));
        
        // Then update status to canceled
        const statusUpdated = await Order.updateStatus(Number(originalOrderId), 'canceled');
        
        if (statusUpdated) {
          console.log('Order status updated to CANCELED');
        } else {
          console.error('Failed to update order status to canceled');
        }
      } else {
        console.log('Order not found for failed payment:', originalOrderId);
      }
    } catch (error) {
      console.error('Error handling failed payment:', error);
    }

    // Redirect to payment failed page instead of checkout
    const failureMessage = req.query.message || 'Thanh toán đã bị hủy hoặc xảy ra lỗi';
    const redirectUrl = `/payment/failed?orderId=${originalOrderId}&message=${encodeURIComponent(failureMessage.toString())}`;
    console.log('FAILED: Redirecting to:', redirectUrl);
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Unexpected error in MoMo return handler:', error);
    return res.redirect('/payment/failed?error=unexpected');
  }
};

/**
 * Handle IPN (Instant Payment Notification) from MoMo
 */
export const handleIpn = async (req: Request, res: Response): Promise<void> => {
  try {
    const callbackData = req.body as MomoReturnResponse;
    
    // Extract data from the callback
    const { orderId, resultCode, message, amount, transId, extraData } = callbackData;
    
    // Verify callback signature
    const isValid = momoService.verifyCallback(callbackData);
    
    if (!isValid) {
      console.error('Invalid MoMo IPN signature');
      res.status(400).json({ success: false, message: 'Invalid signature' });
      return;
    }

    // Extract original order ID from extraData
    let originalOrderId = orderId;
    if (extraData) {
      try {
        const decodedData = JSON.parse(Buffer.from(extraData, 'base64').toString());
        if (decodedData.originalOrderId) {
          originalOrderId = decodedData.originalOrderId;
        }
      } catch (err) {
        console.error('Error decoding extraData:', err);
      }
    }

    // Update order status based on payment result
    if (resultCode === 0) {
      // Payment successful
      try {
        const order = await Order.findById(Number(originalOrderId));
        
        if (order) {
          // Update payment method and notes
          // @ts-ignore - Suppress type errors with database model
          await Order.update({
            payment_method: 'momo',
            notes: `Thanh toán MoMo thành công - Mã giao dịch: ${transId}`
          }, Number(originalOrderId));
          
          // Then update status to confirmed - this will trigger stock reduction
          const statusUpdated = await Order.updateStatus(Number(originalOrderId), 'confirmed');
          
          if (statusUpdated) {
            console.log('IPN: Order status updated to CONFIRMED and stock reduced');
          } else {
            console.error('IPN: Failed to update order status');
          }
          
          res.status(200).json({ success: true, message: 'IPN processed successfully' });
        } else {
          console.error(`IPN: Order not found: ${originalOrderId}`);
          res.status(404).json({ success: false, message: 'Order not found' });
        }
      } catch (dbError) {
        console.error('IPN: Error updating order:', dbError);
        res.status(500).json({ success: false, message: 'Database error' });
      }
    } else {
      // Payment failed
      console.error('IPN: Payment failed:', message);
      
      // Update order status to payment failed
      try {
        const order = await Order.findById(Number(originalOrderId));
        if (order) {
          // Update payment method and notes
          // @ts-ignore - Suppress type errors with database model
          await Order.update({
            payment_method: 'momo',
            notes: `Thanh toán MoMo thất bại: ${message || 'Không rõ lý do'}`
          }, Number(originalOrderId));
          
          // Then update status to canceled
          const statusUpdated = await Order.updateStatus(Number(originalOrderId), 'canceled');
          
          if (statusUpdated) {
            console.log('IPN: Order status updated to CANCELED');
          } else {
            console.error('IPN: Failed to update order status to canceled');
          }
        }
        
        res.status(200).json({ success: true, message: 'IPN processed successfully' });
      } catch (dbError) {
        console.error('IPN: Error updating order status:', dbError);
        res.status(500).json({ success: false, message: 'Database error' });
      }
    }
  } catch (error) {
    console.error('Error handling MoMo IPN:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Query payment status for a given order
 */
export const queryPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      res.status(400).json({ success: false, message: 'Missing order ID' });
      return;
    }
    
    // Query payment status
    const requestId = uuidv4();
    const paymentStatus = await momoService.queryPayment(orderId, requestId);
    
    res.status(200).json({
      success: true,
      data: paymentStatus
    });
  } catch (error) {
    console.error('Error querying MoMo payment status:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while querying the payment status'
    });
  }
}; 