export const JWTVerifier = async (req, res, next) => {
    const jwtToken = req.headers[API_HEADERS.JWT_TOKEN];
    const jwtConsumer = req.headers[API_HEADERS.JWT_CONSUMER];
    const payload = {};
    if (!jwtToken || !jwtConsumer) {
      return res.status(400).json({ message: MESSAGES.NOT_FOUND });
    }
  
  try {
      const secret = SECRETS[jwtConsumer];
      if (!secret) {
        return res.status(403).json({ message: MESSAGES.NOT_VALID_CLIENT });
      }
      _.merge(payload, req.query, req.body);
      try {
        jwt.verify(bopClientToken, secret);// Verify only token not data.
        const decoded = jwt.decode(jwtToken, { complete: true });
        // Verifying the data sent inside the token should be same as payload.
        if (!_.isEqual(decoded.payload, payload)) { 
          return res.status(403).json({ message: MESSAGES.NOT_VALID_PAYLOAD });
        }
        return next();
      } catch (err) {
        return res.status(403).json({ message: MESSAGES.NOT_FOUND });
      }
    } catch (error) {
      return next(error);
    }
  };