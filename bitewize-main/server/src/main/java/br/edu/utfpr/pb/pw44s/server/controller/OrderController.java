package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.ProductOrderDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.ProductOrder;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import br.edu.utfpr.pb.pw44s.server.service.IProductOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("order")
public class OrderController extends CrudController<Order, OrderDTO, Long> {

    private final IOrderService orderService;
    private final ModelMapper modelMapper;

    private final IProductOrderService productOrderService;

    public OrderController(IOrderService orderService,
                           IProductOrderService productOrderService,
                           ModelMapper modelMapper) {
        super(Order.class, OrderDTO.class);
        this.orderService = orderService;
        this.productOrderService = productOrderService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/add-to-cart")
    public ResponseEntity<?> addToCart(@RequestBody ProductOrderDTO dto) {

        //  Buscar pedido aberto
        Order order = orderService.findOpenOrderByUserId(dto.getUserId());

        if (order == null) {
            order = Order.builder()
                    .userId(dto.getUserId())
                    .status("OPEN")
                    .dateTime(LocalDateTime.now())
                    .build();

            order = orderService.save(order);
        }
        dto.setOrderId(order.getId());
        ProductOrder productOrder = modelMapper.map(dto, ProductOrder.class);

        productOrderService.save(productOrder);

        return ResponseEntity.ok("Produto adicionado ao carrinho!");
    }

    @GetMapping("/cart/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        Order order = orderService.findOpenOrderByUserId(userId);
        if (order == null) {
            return ResponseEntity.ok(List.of());
        }
        List<ProductOrderDTO> items = productOrderService.findProductOrderByOrderId(order.getId())
                .stream()
                .map(po -> modelMapper.map(po, ProductOrderDTO.class))
                .toList();

        return ResponseEntity.ok(new CartResponse(modelMapper.map(order, OrderDTO.class), items));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.findAllByUserId(userId);
        List<OrderDTO> orderDTOs = orders.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .toList();

        return ResponseEntity.ok(orderDTOs);
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        Order order = orderService.findOpenOrderByUserId(request.userId());

        if (order == null) {
            order = Order.builder()
                    .userId(request.userId())
                    .status("OPEN")
                    .dateTime(LocalDateTime.now())
                    .build();
        }

        order.setAddress(request.addressId());
        order.setPaymentMethod(request.paymentMethod());
        order.setStatus("PROCESSING");
        order.setDateTime(LocalDateTime.now());
        order = orderService.save(order);

        // remove itens antigos deste carrinho e recria com a lista enviada
      //  productOrderService.deleteByOrderId(order.getId());

        for (ProductOrderDTO dto : request.items()) {
            dto.setOrderId(order.getId());
            dto.setUserId(request.userId());
            ProductOrder po = modelMapper.map(dto, ProductOrder.class);
            productOrderService.save(po);
        }

        return ResponseEntity.ok(new CartResponse(modelMapper.map(order, OrderDTO.class), request.items()));
    }


    @Override
    protected ICrudService<Order, Long> getService() {
        return orderService;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return modelMapper;
    }

    private record CartResponse(OrderDTO order, List<ProductOrderDTO> items) {}
}
