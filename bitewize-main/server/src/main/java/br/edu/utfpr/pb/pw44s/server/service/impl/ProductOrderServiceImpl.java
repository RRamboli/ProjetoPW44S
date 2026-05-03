package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.ProductOrder;
import br.edu.utfpr.pb.pw44s.server.repository.ProductOrderRepository;
import br.edu.utfpr.pb.pw44s.server.service.IProductOrderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
//CrudServiceImpl
public class ProductOrderServiceImpl extends CrudServiceImpl<ProductOrder, Long> implements IProductOrderService {

    private final ProductOrderRepository productOrderRepository;

    public ProductOrderServiceImpl(ProductOrderRepository productOrderRepository) {
        this.productOrderRepository = productOrderRepository;
    }

    @Override
    public List<ProductOrder> findProductOrderByOrderId(Long orderId) {
        return this.productOrderRepository.findProductOrderByOrderId(orderId);
    }

    @Override
    public void deleteByOrderId(Long orderId) {
        this.productOrderRepository.deleteByOrderId(orderId);
    }

    @Override
    public List<ProductOrder> findByUserId(Long userId) {
        return this.productOrderRepository.findByUserId(userId);
    }

    @Override
    protected JpaRepository<ProductOrder, Long> getRepository() {
        return productOrderRepository;
    }
}
