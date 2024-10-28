const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const otpStore = {};

const sendOtp = async (phone) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP
    otpStore[phone] = otp;

    await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${phone}`,
    });

    return { message: 'OTP sent successfully' };
};

const verifyOtp = (phone, otp) => {
    if (otpStore[phone] && otpStore[phone] === otp) {
        delete otpStore[phone];
        return true;
    }
    return false;
};

module.exports = {
    sendOtp,
    verifyOtp
};
