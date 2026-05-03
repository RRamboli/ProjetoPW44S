package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl extends CrudServiceImpl<Order, Long> implements IOrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Order findOpenOrderByUserId(Long userId) {
        return orderRepository.findByUserIdAndStatus(userId, "OPEN")
                .orElse(null);
    }

    @Override
    public List<Order> findAllByUserId(Long userId) {
        return orderRepository.findByUserIdAndStatusNot(userId, "OPEN");
    }

    @Override
    public List<Order> findOrderById(Long orderId) {
        return this.orderRepository.findOrderById(orderId);
    }

    @Override
    protected JpaRepository<Order, Long> getRepository() {
        return orderRepository;
    }
}
