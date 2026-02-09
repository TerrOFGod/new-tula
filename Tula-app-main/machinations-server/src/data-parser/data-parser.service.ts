import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class DataParserService {
    async saveData(code: string): Promise<string> {
        try {
            const fileName = `parsed_data_${Date.now()}.json`;
            const filePath = `./parsed_data/${fileName}`;

            await fs.promises.writeFile(filePath, code);

            return fileName;
        } catch (error) {
            throw new Error('Error saving data');
        }
    }
}