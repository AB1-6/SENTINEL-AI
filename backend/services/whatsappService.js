/**
 * Sentinel AI 2.0 - WhatsApp Dispatch Service
 * Supports:
 * 1. Deep-link Universal Dispatch (Zero setup, 100% free via WhatsApp Web / App)
 * 2. Headless Background Dispatch (via Twilio WhatsApp Business API if configured in .env)
 */

export const isWhatsAppConfigured = () => {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_NUMBER
  );
};

export const getWhatsAppStatus = () => {
  const configured = isWhatsAppConfigured();
  return {
    configured,
    provider: configured ? 'TWILIO_WHATSAPP_API' : 'DIRECT_DEEP_LINK',
    fromNumber: process.env.TWILIO_WHATSAPP_NUMBER || null,
    accountSid: process.env.TWILIO_ACCOUNT_SID ? `${process.env.TWILIO_ACCOUNT_SID.slice(0, 6)}...` : null
  };
};

/**
 * Sends a WhatsApp message via Twilio API if configured,
 * or returns a pre-formatted universal WhatsApp deep-link.
 */
export const sendWhatsAppNotice = async ({ toPhone, message, clientName, invoiceId }) => {
  const cleanPhone = (toPhone || '').replace(/[^0-9]/g, '');
  const universalUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

  if (!isWhatsAppConfigured()) {
    return {
      success: true,
      deliveredSilently: false,
      method: 'DIRECT_DEEP_LINK',
      phone: toPhone,
      cleanPhone,
      universalUrl,
      note: 'Twilio WhatsApp API is not configured in .env. 1-Click WhatsApp direct link generated.'
    };
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER.startsWith('whatsapp:')
      ? process.env.TWILIO_WHATSAPP_NUMBER
      : `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
    
    const formattedTo = `whatsapp:+${cleanPhone}`;

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams();
    params.append('From', fromNumber);
    params.append('To', formattedTo);
    params.append('Body', message);

    const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await resp.json();
    if (resp.ok) {
      return {
        success: true,
        deliveredSilently: true,
        method: 'TWILIO_WHATSAPP_API',
        sid: data.sid,
        phone: toPhone,
        universalUrl
      };
    } else {
      return {
        success: false,
        deliveredSilently: false,
        method: 'TWILIO_WHATSAPP_API',
        error: data.message || 'Twilio WhatsApp dispatch failed',
        phone: toPhone,
        universalUrl
      };
    }
  } catch (err) {
    return {
      success: false,
      deliveredSilently: false,
      error: err.message,
      phone: toPhone,
      universalUrl
    };
  }
};
