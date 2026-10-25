const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, user) => {
  const payload = {
    id: user._id,
    role: user.role
  };

  const secret = process.env.JWT_SECRET || 'fallback_secret_rental_portal_fsd_2026';
  const token = jwt.sign(payload, secret, {
    expiresIn: '7d'
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieSecure = process.env.COOKIE_SECURE === 'true' || isProduction;

  res.cookie('token', token, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: cookieSecure ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

module.exports = { generateTokenAndSetCookie };
