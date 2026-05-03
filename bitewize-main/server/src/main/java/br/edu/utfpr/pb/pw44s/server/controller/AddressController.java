package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("addresses")
public class AddressController extends CrudController<Address, AddressDTO, Long > {

    private final IAddressService addressService;
    private final ModelMapper modelMapper;

    public AddressController(IAddressService addressService,ModelMapper modelMapper) {
        super(Address.class, AddressDTO.class);
        this.addressService = addressService;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<Address, Long> getService() {
        return addressService;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return modelMapper;
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<java.util.List<AddressDTO>> findAllByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(
                addressService.findAllByUserId(userId)
                        .stream()
                        .map(a -> modelMapper.map(a, AddressDTO.class))
                        .toList()
        );
    }
}
