import emailjs from '@emailjs/browser';

const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Jp0QnAwAcLSIZLQJF';
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_yn7kice';
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_76nazzn';

if (publicKey) {
  emailjs.init(publicKey);
}

/**
 * Fire-and-forget email sender. Never throws, never blocks the UI.
 * Handles:
 *   - 412 Invalid grant: Gmail OAuth expired → fix in EmailJS dashboard
 *   - Any other network / EmailJS errors
 */
function safeSend(params: Record<string, string>): void {
  if (!serviceId || !templateId) return;
  emailjs.send(serviceId, templateId, params).catch((err: any) => {
    const status = err?.status ?? err?.statusCode ?? 0;
    if (status === 412) {
      console.warn(
        '[EmailJS] Gmail OAuth token expired. ' +
        'Fix: EmailJS Dashboard → Email Services → service_yn7kice → Reconnect Account.'
      );
    } else {
      console.warn('[EmailJS] Email send failed (non-blocking):', err?.text ?? err?.message ?? err);
    }
  });
}

export const sendShipmentEmail = (shipment: any): void => {
  const toEmail = shipment.receiver_email || shipment.to?.email || shipment.userEmail;
  if (!toEmail) return;

  const trackingNumber = shipment.trackingNumber || shipment.tracking_code || 'Unknown';
  const senderName = shipment.from?.name || shipment.sender_name || 'FIRSTRANK PARCEL Logistics';

  const extraDetailsHtml = `
    <div style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 10px 0;font-size:14px;color:#4B5563;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p style="margin:0 0 10px 0;font-size:14px;color:#4B5563;"><strong>Service:</strong> ${shipment.service || 'Standard Delivery'}</p>
      <p style="margin:0 0 10px 0;font-size:14px;color:#4B5563;"><strong>Origin:</strong> ${senderName}</p>
      <p style="margin:0 0 10px 0;font-size:14px;color:#4B5563;"><strong>Destination:</strong> ${shipment.to?.name || shipment.receiver_name || 'Recipient'}</p>
      <p style="margin:0;font-size:14px;color:#4B5563;"><strong>Expected Delivery:</strong> ${shipment.estimatedDelivery || shipment.expected_delivery_date || 'TBD'}</p>
    </div>
  `;

  safeSend({
    to_email: toEmail,
    to_name: shipment.to?.name || shipment.receiver_name || 'Customer',
    notification_type: 'Shipment Update',
    main_title: 'Your shipment is on its way',
    message_body: `${senderName} has created a shipment for you. Track your package using the link below.`,
    extra_details_html: extraDetailsHtml,
    action_text: 'Track Package',
    action_url: `https://firstrankparcel.com/tracking?tn=${trackingNumber}`,
  });
};

export const sendBillEmail = (toEmail: string, title: string, amount: number, note: string, hasAttachment?: boolean | string): void => {
  const formattedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const extraDetailsHtml = `
    <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:24px 0;">
      <h3 style="margin-top:0;margin-bottom:16px;color:#111827;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #e5e7eb;padding-bottom:12px;">Invoice Details</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#6b7280;font-size:14px;">Invoice</td><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#111827;font-size:14px;font-weight:bold;text-align:right;">${title}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#6b7280;font-size:14px;">Amount Due</td><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#dc2626;font-size:16px;font-weight:bold;text-align:right;">$${amount.toFixed(2)}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#6b7280;font-size:14px;">Date Issued</td><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#111827;font-size:14px;font-weight:bold;text-align:right;">${formattedDate}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280;font-size:14px;">Attachment</td><td style="padding:10px 0;color:#111827;font-size:14px;font-weight:bold;text-align:right;">${hasAttachment ? '📎 Included — view in dashboard' : 'None'}</td></tr>
      </table>
    </div>
  `;

  safeSend({
    to_email: toEmail,
    notification_type: 'Billing',
    main_title: `New Invoice: ${title}`,
    message_body: `A new invoice of $${amount.toFixed(2)} has been issued to your account.\n\n${note}\n\nPlease log into your dashboard to view the full invoice details.`,
    extra_details_html: extraDetailsHtml,
    action_text: 'View Invoice',
    action_url: 'https://firstrankparcel.com/billing',
  });
};

export const sendBillClearedEmail = (toEmail: string, title: string, amount: number): void => {
  safeSend({
    to_email: toEmail,
    notification_type: 'Payment',
    main_title: `Payment Confirmed: ${title}`,
    message_body: `Your payment of $${amount.toFixed(2)} for ${title} has been approved and cleared. Your shipment is now fully processed and on its way to you.`,
    extra_details_html: '',
    action_text: 'Track Shipment',
    action_url: 'https://firstrankparcel.com/tracking',
  });
};

export const sendBillPaidEmail = (
  receiverEmail: string,
  bill: { id: string; title: string; amount: number; paidAt?: string },
  receiverName?: string
): void => {
  if (!receiverEmail || !receiverEmail.includes('@')) return;

  const paymentDate = bill.paidAt ? new Date(bill.paidAt) : new Date();
  const formattedDate = paymentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = paymentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const extraDetailsHtml = `
    <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:24px 0;">
      <h3 style="margin-top:0;margin-bottom:16px;color:#111827;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #e5e7eb;padding-bottom:12px;">Payment Receipt</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#6b7280;font-size:14px;">Invoice ID</td><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#111827;font-size:14px;font-weight:bold;text-align:right;font-family:monospace;">#${bill.id.split('-')[1]?.toUpperCase() || bill.id}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#6b7280;font-size:14px;">Amount Paid</td><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#059669;font-size:16px;font-weight:bold;text-align:right;">$${bill.amount.toFixed(2)}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#6b7280;font-size:14px;">Date</td><td style="padding:10px 0;border-bottom:1px dashed #e5e7eb;color:#111827;font-size:14px;font-weight:bold;text-align:right;">${formattedDate}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280;font-size:14px;">Time</td><td style="padding:10px 0;color:#111827;font-size:14px;font-weight:bold;text-align:right;">${formattedTime}</td></tr>
      </table>
    </div>
  `;

  safeSend({
    to_email: receiverEmail.trim(),
    to_name: receiverName || 'Customer',
    notification_type: 'Receipt',
    main_title: `Invoice Paid: ${bill.title}`,
    message_body: `The invoice "${bill.title}" for $${bill.amount.toFixed(2)} has been paid successfully. Your shipment is now cleared and on its way to you.`,
    extra_details_html: extraDetailsHtml,
    action_text: 'Track Shipment',
    action_url: 'https://firstrankparcel.com/tracking',
  });
};

export const sendDepositEmail = (toEmail: string, amount: number, status: string): void => {
  const isApproved = status.toLowerCase() === 'approved';
  safeSend({
    to_email: toEmail,
    notification_type: 'Account Update',
    main_title: isApproved ? 'Deposit Confirmed' : 'Deposit Update',
    message_body: isApproved
      ? `Your deposit of $${amount.toFixed(2)} has been reviewed and credited to your account balance.`
      : `Your deposit of $${amount.toFixed(2)} could not be processed at this time. Please contact our support team for assistance.`,
    extra_details_html: '',
    action_text: 'View Dashboard',
    action_url: 'https://firstrankparcel.com/dashboard',
  });
};

export const sendAccountEmail = (toEmail: string, status: string): void => {
  const isApproved = status.toLowerCase() === 'approved';
  safeSend({
    to_email: toEmail,
    notification_type: 'Account',
    main_title: isApproved ? 'Welcome to Firstrank Parcel' : 'Account Application Update',
    message_body: isApproved
      ? `Your account has been approved. You now have full access to the Firstrank Parcel dashboard and can start tracking and managing your shipments.`
      : `After reviewing your application, we are unable to approve your account at this time. Please contact our support team for more details.`,
    extra_details_html: '',
    action_text: isApproved ? 'Go to Dashboard' : 'Contact Support',
    action_url: isApproved ? 'https://firstrankparcel.com/auth/login' : 'https://firstrankparcel.com/support/help-center',
  });
};
