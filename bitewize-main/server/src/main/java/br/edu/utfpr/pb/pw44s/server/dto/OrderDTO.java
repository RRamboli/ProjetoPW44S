package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.User;
import lombok.Data;

@Data
public class OrderDTO {
    private Long id;
    private Long userId;
    private java.time.LocalDateTime dateTime;
    private String status;
    private Long address;
    private String paymentMethod;
}
