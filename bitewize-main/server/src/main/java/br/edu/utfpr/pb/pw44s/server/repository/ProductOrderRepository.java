package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductOrderRepository extends JpaRepository<ProductOrder, Long> {
    List<ProductOrder> findProductOrderByOrderId(Long orderId);
    void deleteByOrderId(Long orderId);
    List<ProductOrder> findByUserId(Long userId);
}
