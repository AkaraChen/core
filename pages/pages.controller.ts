import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CreatePagesDto } from './create-pages-dto';
import { PagesService } from './pages.service';

@Controller('pages')
@ApiTags("Pages")
export class PagesController {
    constructor(private pagesService: PagesService){}
    @Get('list')
    async list(){
        return this.pagesService.list()
    }

    @Get(':path')
    async findOne(@Param() params){
        return this.pagesService.findOne(params.path)
    }
    
    @Post('send')
    // @UseGuards(AuthGuard('jwt'))
    async send(@Body() data: CreatePagesDto){
        // here is no need to filter XSS here
        // because this is user controller only
        return await this.pagesService.send(data)
    }
}
