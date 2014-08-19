module.exports = function (req, res, next) {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-XSS-Protection', '1; mode=block');
  res.set('X-Frame-Options', 'SAMEORIGIN');
  next();
};
