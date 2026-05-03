package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductOrderDTO {
    private Long id;
    private Long orderId;
    private Long userId;
    private Long productId;
    private Integer quantity;
    private BigDecimal price;

}
