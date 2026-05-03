package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.ProductOrder;

import java.util.List;

public interface IProductOrderService extends ICrudService<ProductOrder, Long> {

    List<ProductOrder> findProductOrderByOrderId(Long orderId);
    void deleteByOrderId(Long orderId);
    List<ProductOrder> findByUserId(Long userId);

}
