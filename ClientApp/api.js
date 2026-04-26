const API_BASE = 'https://localhost:5001/api';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Auth
export async function login(Username, Password) {
  return apiRequest('/auth/login', {
    method: 'POST',
   body: JSON.stringify({
  Username: Username,
  Password: Password
}),
  });
}

export async function register(Username, Password) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      Username: Username,
      Password: Password
    }),
  });
}

// Topics
export async function getAllTopics() {
  return apiRequest('/topics');
}

export async function getTopicById(id) {
  return apiRequest(`/topics/${id}`);
}

export async function createTopic(title, userId) {
  return apiRequest('/topics', {
    method: 'POST',
    body: JSON.stringify({ title, userId }),
  });
}

// Subscriptions
export async function subscribe(userId, topicId) {
  return apiRequest('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ userId, topicId }),
  });
}

export async function unsubscribe(userId, topicId) {
  return apiRequest('/subscriptions', {
    method: 'DELETE',
    body: JSON.stringify({ userId, topicId }),
  });
}

export async function getUserSubscriptions(userId) {
  return apiRequest(`/subscriptions/user/${userId}`);
}

// Messages
export async function getMessages(topicId) {
  return apiRequest(`/messages/${topicId}`);
}

export async function createMessage(message) {
  return apiRequest('/messages', {
    method: 'POST',
    body: JSON.stringify(message),
  });
}