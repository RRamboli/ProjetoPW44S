package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl extends CrudServiceImpl<Address, Long> implements IAddressService {

    private final AddressRepository addressRepository;

    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Override
    public List<Address> findAllByUserId(Long userId) {
        return this.addressRepository.findAllByUserId(userId);
    }

    @Override
    protected JpaRepository<Address, Long> getRepository() {
        return addressRepository;
    }
}
