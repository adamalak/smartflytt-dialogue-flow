
import { v4 as uuidv4 } from 'uuid';

export const getUserSessionId = (): string => {
  const sessionKey = 'chatbot_user_session';
  let sessionId = localStorage.getItem(sessionKey);
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(sessionKey, sessionId);
  }
  
  return sessionId;
};

export const clearUserSession = (): void => {
  localStorage.removeItem('chatbot_user_session');
};
