
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class SumsubService {
  private readonly baseUrl = 'https://api.sumsub.com';

  constructor(private readonly configService: ConfigService) {}

  // Generate signature for outgoing Sumsub API requests
  private createSignature(
    timestamp: number,
    method: string,
    path: string,
    body: string = '',
  ): string {
    const secretKey = this.configService.get<string>(
      'SUMSUB_SECRET_KEY',
    );

    if (!secretKey) {
      throw new Error('SUMSUB_SECRET_KEY is missing');
    }

    const data = timestamp + method.toUpperCase() + path + body;

    return crypto
      .createHmac('sha256', secretKey)
      .update(data)
      .digest('hex');
  }

  // Send authenticated requests to Sumsub
  async sendRequest(
    method: string,
    path: string,
    body: any = null,
  ) {
    const timestamp = Math.floor(Date.now() / 1000);

    const bodyString = body ? JSON.stringify(body) : '';

    const signature = this.createSignature(
      timestamp,
      method,
      path,
      bodyString,
    );

    const appToken = this.configService.get<string>(
      'SUMSUB_APP_TOKEN',
    );

    if (!appToken) {
      throw new Error('SUMSUB_APP_TOKEN is missing');
    }

    const response = await axios({
      method,
      url: `${this.baseUrl}${path}`,
      data: bodyString || undefined,
      headers: {
        'X-App-Token': appToken,
        'X-App-Access-Ts': timestamp,
        'X-App-Access-Sig': signature,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  // Create a Sumsub applicant
  async createApplicant(externalUserId: string) {
    const levelName = this.configService.get<string>(
      'SUMSUB_LEVEL_NAME',
    );

    if (!levelName) {
      throw new Error('SUMSUB_LEVEL_NAME is missing');
    }

    const path =
      `/resources/applicants?levelName=${encodeURIComponent(levelName)}`;

    const body = {
      externalUserId: externalUserId,
    };

    return this.sendRequest('POST', path, body);
  }

  // Generate Sumsub SDK access token
  async generateSdkToken(externalUserId: string) {
    const levelName = this.configService.get<string>(
      'SUMSUB_LEVEL_NAME',
    );

    if (!levelName) {
      throw new Error('SUMSUB_LEVEL_NAME is missing');
    }

    const path = '/resources/accessTokens/sdk';

    const body = {
      ttlInSecs: 600,
      userId: externalUserId,
      levelName: levelName,
    };

    return this.sendRequest('POST', path, body);
  }

  // Verify incoming Sumsub webhook signature
  verifyWebhookSignature(
    rawBody: Buffer,
    receivedDigest: string,
    algorithm: string,
  ): boolean {
    const webhookSecret = this.configService.get<string>(
      'SUMSUB_WEBHOOK_SECRET',
    );

    if (!webhookSecret || !receivedDigest) {
      return false;
    }

    const algorithms: Record<string, string> = {
      HMAC_SHA1_HEX: 'sha1',
      HMAC_SHA256_HEX: 'sha256',
      HMAC_SHA512_HEX: 'sha512',
    };

    const selectedAlgorithm = algorithms[algorithm];

    if (!selectedAlgorithm) {
      return false;
    }

    const calculatedDigest = crypto
      .createHmac(selectedAlgorithm, webhookSecret)
      .update(rawBody)
      .digest('hex');

    const receivedBuffer = Buffer.from(receivedDigest, 'hex');
    const calculatedBuffer = Buffer.from(calculatedDigest, 'hex');

    if (receivedBuffer.length !== calculatedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(
      calculatedBuffer,
      receivedBuffer,
    );
  }
}
