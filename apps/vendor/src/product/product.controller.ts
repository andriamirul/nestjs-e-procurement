import { IdParamDto } from '@libs';
import { ProductPaginateRequest } from '@libs/clients/vendor/dto/product/product-paginate-request.dto';
import { ProductPaginateResponse } from '@libs/clients/vendor/dto/product/product-paginate-response.dto';
import { ProductResponse } from '@libs/clients/vendor/dto/product/product-response.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Vendor } from '@vendor/auth/entities/vendor.entity';
import { Auth } from '@vendor/auth/guards/auth.decorator';
import { CurrentUser } from '@vendor/common/decorator/current-user.decorator';
import { CreateProductRequest } from './dto/create-product-request.dto';
import { UpdateProductRequest } from './dto/update-product-request.dto';
import { ProductService } from './product.service';

@Auth()
@ApiTags(`Product`)
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body() createProductDto: CreateProductRequest,
    @CurrentUser() currentUser: Vendor,
  ) {
    return this.productService.create(createProductDto, currentUser);
  }

  @Get()
  paginate(
    @Query() req: ProductPaginateRequest,
  ): Promise<ProductPaginateResponse> {
    return this.productService.paginate(req);
  }

  @Get(':id')
  async findOne(@Param() req: IdParamDto): Promise<ProductResponse> {
    return new ProductResponse(
      await this.productService.findOneOrThrow(req.id),
    );
  }

  @Put(':id')
  async update(
    @Param() req: IdParamDto,
    @Body() product: UpdateProductRequest,
    @CurrentUser() currentUser: Vendor,
  ): Promise<ProductResponse> {
    return new ProductResponse(
      await this.productService.update(req.id, product, currentUser),
    );
  }

  @Delete(':id')
  remove(@Param() req: IdParamDto): Promise<void> {
    return this.productService.remove(req.id);
  }
}
