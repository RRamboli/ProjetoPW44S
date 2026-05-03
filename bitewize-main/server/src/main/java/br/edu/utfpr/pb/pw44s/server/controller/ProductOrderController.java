package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.ProductOrderDTO;
import br.edu.utfpr.pb.pw44s.server.model.ProductOrder;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IProductOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("productOrder")
public class ProductOrderController extends CrudController<ProductOrder, ProductOrderDTO, Long> {

    private final IProductOrderService productOrderService;
    private final ModelMapper modelMapper;

    public ProductOrderController(IProductOrderService productOrderService, ModelMapper modelMapper) {
        super(ProductOrder.class, ProductOrderDTO.class);
        this.productOrderService = productOrderService;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<ProductOrder, Long> getService() {
        return productOrderService;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return modelMapper;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> findByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(
                productOrderService.findByUserId(userId)
                        .stream()
                        .map(po -> modelMapper.map(po, ProductOrderDTO.class))
                        .toList()
        );
    }
}
