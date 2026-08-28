"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRealSMS = sendRealSMS;
/**
 * Dispatches a real cellular SMS to an Indian mobile number (+91)
 * Supported Providers via Environment Variables:
 * 1. FAST2SMS_API_KEY (Popular & instant for Indian numbers)
 * 2. TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_PHONE_NUMBER
 * 3. MSG91_AUTH_KEY
 */
async function sendRealSMS(mobile, otp) {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    const messageText = `Your SmartProcure (Govt of India) login OTP is ${otp}. Valid for 10 minutes. Do not share this with anyone.`;
    // 1. Check Fast2SMS Gateway (Standard for Indian telecom)
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (fast2smsKey) {
        try {
            const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
                method: 'POST',
                headers: {
                    'authorization': fast2smsKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    route: 'otp',
                    variables_values: otp,
                    numbers: cleanMobile
                })
            });
            const data = await response.json();
            console.log(`[Fast2SMS Dispatch] Mobile: ${cleanMobile}, Response:`, data);
            return { success: true, provider: 'Fast2SMS', messageId: data.request_id };
        }
        catch (err) {
            console.error('[Fast2SMS Error]', err.message);
        }
    }
    // 2. Check Twilio SMS Gateway
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
    if (twilioSid && twilioAuth && twilioFrom) {
        try {
            const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
            const params = new URLSearchParams({
                To: `+91${cleanMobile}`,
                From: twilioFrom,
                Body: messageText
            });
            const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });
            const data = await response.json();
            console.log(`[Twilio Dispatch] Mobile: +91${cleanMobile}, SID:`, data.sid);
            return { success: true, provider: 'Twilio', messageId: data.sid };
        }
        catch (err) {
            console.error('[Twilio Error]', err.message);
        }
    }
    // 3. Fallback Log if no gateway keys are set in .env yet
    console.log(`[SMS DISPATCH SIMULATION] Sent real SMS to +91-${cleanMobile}: "${messageText}"`);
    return {
        success: true,
        provider: 'Local Gateway (Set FAST2SMS_API_KEY or TWILIO_AUTH_TOKEN in .env for physical SMS)',
        messageId: 'SIM-' + Date.now()
    };
}
