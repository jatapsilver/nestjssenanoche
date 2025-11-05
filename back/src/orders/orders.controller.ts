import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

import { CreateOrderDto } from './Dtos/createOrder.dto';
import { RolesEnum } from 'src/enums/roles.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //Endpoint para obtener todas las órdenes
  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las órdenes obtenidas correctamente',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Get('getAllOrders')
  async getAllOrders() {
    return await this.ordersService.getAllOrdersService();
  }

  //Endpoint para obtener las órdenes de un usuario específico
  @ApiOperation({ summary: 'Obtener las órdenes de un usuario específico' })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes del usuario obtenidas correctamente',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('getUserOrders/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return await this.ordersService.getUserOrdersService(userId);
  }

  //Endpoint para crear una nueva orden
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({
    status: 201,
    description: 'Orden creada correctamente',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('createOrder')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.createOrderService(createOrderDto);
  }
}
