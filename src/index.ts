import * as https from 'https';
import { stringify } from 'querystring';

interface Token {
  access_token: string;
  expires_in: number;
  issued_at: number;
}

class TokenManager {
  private token: Token | null = null;
  private clientId: string;
  private clientSecret: string;
  private tokenEndpoint: string;
  private scope: string;

  constructor(clientId: string, clientSecret: string, tokenEndpoint: string, scope: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tokenEndpoint = tokenEndpoint;
    this.scope = scope;

    this.fetchToken().catch(err => console.error('Failed to fetch initial token:', err));
  }

  public async getToken(): Promise<string> {
    if (!this.token || this.isTokenExpired()) {
      await this.fetchToken();
    }
    return this.token!.access_token;
  }

  private isTokenExpired(): boolean {
    const now = Math.floor(new Date().getTime() / 1000);
    return !this.token || (this.token.issued_at + this.token.expires_in) <= now;
  }

  private fetchToken(): Promise<void> {
    return new Promise((resolve, reject) => {
      const postData = stringify({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: this.scope
      });

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(this.tokenEndpoint, options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const response = JSON.parse(data);
          const now = Math.floor(new Date().getTime() / 1000);
          this.token = {
            access_token: response.access_token,
            expires_in: response.expires_in,
            issued_at: now
          };
          resolve();
        });
      });

      req.on('error', (e) => {
        reject(`Problem with request to AWS Cognito: ${e.message}`);
      });

      req.write(postData);
      req.end();
    });
  }
}

export default TokenManager;
