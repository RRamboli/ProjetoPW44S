package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findOrderById(Long orderId);
    Optional<Order> findByUserIdAndStatus(Long userId, String status);
    List<Order> findByUserIdAndStatusNot(Long userId, String status);
}
