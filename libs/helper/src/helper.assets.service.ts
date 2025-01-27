import { Injectable, InternalServerErrorException } from '@nestjs/common';
import AdmZip from 'adm-zip';
import { HttpService } from './helper.http.service';
import fs from 'fs';
import { isURL } from 'class-validator';
import { tmpdir } from 'os';

@Injectable()
export class AssetsService {
  constructor(private readonly http: HttpService) {}

  async downloadZIPAndExtract(url: string, _path: string, name?: string) {
    // 1. Check if the URL is valid.
    if (!isURL(url)) {
      throw new InternalServerErrorException('Invalid URL');
    }
    // 2. Download the ZIP file.
    const res = await this.http.axiosRef(url, {
      responseType: 'arraybuffer',
    });
    // 3. Convert the downloaded data to a buffer.
    const buffer = Buffer.from(res.data, 'binary');
    // 4. Extract the ZIP file.
    await this.extractZIP(buffer, _path, name);
    return true;
  }

  async extractZIP(buffer: Buffer, _path: string, name?: string) {
    const zip = new AdmZip(buffer);
    const real = path.join(_path, name || zip.getEntries()[0].entryName);
    zip.extractAllTo(tmpdir(), true);
    try {
      fs.mkdirSync(real);
      fs.renameSync(path.join(tmpdir(), zip.getEntries()[0].entryName), real);
    } catch {
      // fs.renameSync(path.join(tmpdir(), zip.getEntries()[0].entryName), real);
      throw new InternalServerErrorException('当前主题已存在，正在跳过');
    }
    return true;
  }

  async downloadFile(url: string, _path: string, name?: string) {
    if (!isURL(url)) {
      throw new InternalServerErrorException('Invalid URL');
    }
    const res = await this.http.axiosRef(url, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(res.data, 'binary');
    if (!name) {
      name = url.split('/').pop()!;
    }
    await this.writeFile(buffer, _path, name);
    return true;
  }

  async writeFile(buffer: Buffer, _path: string, name: string) {
    fs.writeFileSync(path.join(_path, name), buffer);
  }

  async uploadZIPAndExtract(buffer: Buffer, _path: string, name?: string) {
    await this.extractZIP(buffer, _path, name);
    return true;
  }
}
