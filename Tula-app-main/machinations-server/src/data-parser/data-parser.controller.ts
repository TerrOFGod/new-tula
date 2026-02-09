// data.controller.ts
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { DataParserService } from './data-parser.service';


@Controller('data')
export class DataParserController {

    private readonly logger = new Logger(DataParserController.name);

    constructor(private readonly dataService: DataParserService) { }

    @Post('save')
    async saveData(@Body() body: { code: string }) {
        const { code } = body;
        this.logger.log(`Received data to save: ${code}`);
        await this.dataService.saveData(code);
        return "ok"
    }
}