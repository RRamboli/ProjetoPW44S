package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.ProductOrderDTO;

import java.util.List;

public record CheckoutRequest(Long userId, Long addressId, String paymentMethod, List<ProductOrderDTO> items) {}
