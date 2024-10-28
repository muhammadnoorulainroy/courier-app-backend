
// const twilio = require('twilio');
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// // OTP store (simple in-memory object, for demo purposes; consider Redis for production)
// const otpStore = {};

// exports.sendOtp = async (phone) => {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();  // 6-digit OTP
//     otpStore[phone] = otp;

//     // Send OTP via WhatsApp
//     await client.messages.create({
//         body: `Your OTP is: ${otp}`,
//         from: process.env.TWILIO_WHATSAPP_NUMBER,
//         to: `whatsapp:${phone}`,
//     });

//     return { message: 'OTP sent successfully' };
// };

// exports.verifyOtp = (phone, otp) => {
//     if (otpStore[phone] && otpStore[phone] === otp) {
//         delete otpStore[phone];  // Clear OTP after successful verification
//         return true;
//     }
//     return false;
// };
    