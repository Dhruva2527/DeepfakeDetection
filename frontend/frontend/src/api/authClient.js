/**
 * Minimal, dependency-free auth client for YOUR OWN backend.
 *
 * Configure with VITE_AUTH_API_URL (default: same origin). Expected endpoints:
 *   POST /api/auth/login            { email, password }            -> { access_token }
 *   POST /api/auth/register         { email, password }            -> 2xx (sends OTP email)
 *   POST /api/auth/verify-otp       { email, otp_code }            -> { access_token }
 *   POST /api/auth/resend-otp       { email }                      -> 2xx
 *   POST /api/auth/reset-password-request { email }                -> 2xx
 *   POST /api/auth/reset-password   { reset_token, new_password }  -> 2xx
 *   GET  /api/auth/me               (Authorization: Bearer <token>) -> user object
 *   GET  /api/auth/google?return_to=...  (browser redirect for OAuth)
 *
 * The detection pages (/, /analyze, ...) do not require auth; this only powers
 * the optional login/register screens.
 */
const BASE = (import.meta.env.VITE_AUTH_API_URL || '').replace(/\/+$/, '');
const TOKEN_KEY = 'truthlens_access_token';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const getToken = () => {
  try { return window.localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
const setToken = (token) => {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch { /* storage unavailable */ }
};

async function call(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Could not reach the server. Please try again.', 0);
  }

  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    throw new ApiError(data?.message || data?.detail || data?.error || `Request failed (${res.status})`, res.status, data);
  }
  return data;
}

export const auth = {
  async loginViaEmailPassword(email, password) {
    const data = await call('/api/auth/login', { method: 'POST', body: { email, password } });
    if (data?.access_token) setToken(data.access_token);
    return data;
  },
  register: ({ email, password }) => call('/api/auth/register', { method: 'POST', body: { email, password } }),
  async verifyOtp({ email, otpCode }) {
    const data = await call('/api/auth/verify-otp', { method: 'POST', body: { email, otp_code: otpCode } });
    if (data?.access_token) setToken(data.access_token);
    return data;
  },
  resendOtp: (email) => call('/api/auth/resend-otp', { method: 'POST', body: { email } }),
  resetPasswordRequest: (email) => call('/api/auth/reset-password-request', { method: 'POST', body: { email } }),
  resetPassword: ({ resetToken, newPassword }) =>
    call('/api/auth/reset-password', { method: 'POST', body: { reset_token: resetToken, new_password: newPassword } }),
  me: () => call('/api/auth/me', { auth: true }),
  setToken,
  loginWithProvider(provider, returnTo = '/') {
    window.location.href = `${BASE}/api/auth/${encodeURIComponent(provider)}?return_to=${encodeURIComponent(returnTo)}`;
  },
  logout(redirectTo) {
    setToken(null);
    if (redirectTo) window.location.href = redirectTo;
  },
  redirectToLogin(returnTo = window.location.href) {
    window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
  },
};
