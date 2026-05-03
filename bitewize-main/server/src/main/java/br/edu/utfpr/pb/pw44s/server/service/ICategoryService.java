package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Category;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;


public interface ICategoryService extends ICrudService<Category, Long> {
    List<Category> findByCategoryNameContaining(String categoryName);

}

