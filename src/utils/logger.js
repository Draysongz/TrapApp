function sanitizeLogMessage(message) {
  // Remove sensitive information from log messages
  const sensitivePatterns = [
    /password=.*/gi,
    /api_key=.*/gi,
    /token=.*/gi
  ];
  
  let sanitizedMessage = message;
  sensitivePatterns.forEach(pattern => {
    sanitizedMessage = sanitizedMessage.replace(pattern, '[REDACTED]');
  });
  
  return sanitizedMessage;
}

export function log(message) {
  const sanitizedMessage = sanitizeLogMessage(message);
  console.log(sanitizedMessage);
}