import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import crypto from 'crypto';

export class EncryptionHelper {
  private static key: Buffer | null = null;

  private static async getKey(): Promise<Buffer> {
    if (this.key) return this.key;

    const client = new SecretsManagerClient({ region: process.env.REGION });
    const command = new GetSecretValueCommand({
      SecretId: process.env.SECRET_NAME!,
    });
    const response = await client.send(command);

    if (!response.SecretString) {
      throw new Error('Secret not found in Secrets Manager');
    }

    const secret = JSON.parse(response.SecretString);
    const keyString = secret.key;

    if (!keyString || keyString.length !== 32) {
      throw new Error('Secret key must be exactly 32 characters for AES-256');
    }

    this.key = Buffer.from(keyString, 'utf-8');
    return this.key;
  }

  public static async encrypt(text: string): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return `${iv.toString('base64')}:${encrypted}`;
  }

  public static async decrypt(encryptedText: string): Promise<string> {
    const key = await this.getKey();
    const [ivBase64, encryptedData] = encryptedText.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
