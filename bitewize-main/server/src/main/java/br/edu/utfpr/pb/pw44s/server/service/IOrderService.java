package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.Order;

import java.util.List;

public interface IOrderService extends ICrudService<Order,Long> {
    List<Order> findOrderById(Long orderId);
    Order findOpenOrderByUserId(Long userId);
    List<Order> findAllByUserId(Long userId);

}
