package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;

@Data
public class AddressDTO {
    private Long id;
    private Long userId;
    private String street;
    private String complement;
    private String zipCode;
    private String city;
    private String state;
    private String country;
    private String number;
    private Boolean isDefault;
}
