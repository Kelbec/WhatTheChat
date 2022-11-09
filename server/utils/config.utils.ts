import * as dotenv from 'dotenv';
import * as fs from 'fs';

class Config {
  private readonly envConfig: Record<string, any>;

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get(key: string): any {
    return this.envConfig[key];
  }

  getNumber(key: string): number {
    return +this.envConfig[key];
  }
}

export const CONFIG = new Config(`process.${process.env.NODE_ENV || 'dev'}.env`);
