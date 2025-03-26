export class GoogleAuth {
  static async authenticate() {
    try {
      const response = await fetch('/api/auth/google');
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Error during Google authentication:', error);
      throw error;
    }
  }
}

export const GoogleAuthExceptionMessages = {
  AUTH_FAILED: 'Failed to authenticate with Google',
  NETWORK_ERROR: 'Network error occurred during authentication',
}; 