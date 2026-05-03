package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Address;
import org.springframework.stereotype.Service;

import java.util.List;

public interface IAddressService extends ICrudService<Address, Long> {
    List<Address> findAllByUserId(Long userId);
}
