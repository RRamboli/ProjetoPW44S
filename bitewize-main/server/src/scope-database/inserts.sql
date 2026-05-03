-- Inserir categorias

INSERT INTO category (category_name) VALUES
('Eletrônicos'),
('Roupas'),
('Livros'),
('Casa e Decoração'),
('Esportes');

-- Inserir usuários
INSERT INTO "users" (username, display_name, password) VALUES
('joao.silva', 'João Silva', 'senha123'),
('maria.santos', 'Maria Santos', 'mariapwd456'),
('carlos.lima', 'Carlos Lima', 'carlos789'),
('ana.costa', 'Ana Costa', 'ana101112');

-- Inserir endereços
INSERT INTO address (user_id, street, complement, zip_code, city, address_state, country, address_number, is_default) VALUES
(1, 'Rua das Flores', 'Apto 101', '01234-567', 'São Paulo', 'SP', 'Brasil', '123', true),
(1, 'Avenida Paulista', 'Sala 305', '01310-100', 'São Paulo', 'SP', 'Brasil', '2000', false),
(2, 'Rua do Comércio', 'Casa 2', '30123-456', 'Belo Horizonte', 'MG', 'Brasil', '45', true),
(3, 'Praça da Sé', 'Loja 12', '01001-000', 'São Paulo', 'SP', 'Brasil', '1', true),
(4, 'Rua da Praia', 'Bloco B', '22010-000', 'Rio de Janeiro', 'RJ', 'Brasil', '300', true);

-- Inserir produtos (adicionando mais atributos conforme necessário)
INSERT INTO product (name) VALUES
('Smartphone Samsung Galaxy S23'),
('Notebook Dell Inspiron 15'),
('Camiseta Nike Dry-Fit'),
('Tênis Adidas Ultraboost'),
('Livro "O Hobbit" - J.R.R. Tolkien'),
('Sofá 3 Lugares Retrátil'),
('Bola de Futebol Penalty'),
('Fone de Ouvido Bluetooth Sony'),
('Vaso Decorativo Cerâmica'),
('Tablet iPad Pro 11"');

-- Inserir pedidos (inclui payment_method)
INSERT INTO orders (date_time, user_id, status, address_id, payment_method) VALUES
('2024-01-15 10:30:00', 1, 'ENTREGUE', 1, 'PIX'),
('2024-01-16 14:45:00', 2, 'PROCESSANDO', 3, 'CREDIT_CARD'),
('2024-01-17 09:15:00', 1, 'ENVIADO', 2, 'BOLETO'),
('2024-01-18 16:20:00', 3, 'PENDENTE', 4, 'PIX'),
('2024-01-19 11:00:00', 4, 'ENTREGUE', 5, 'CREDIT_CARD');

-- Inserir produtos nos pedidos
INSERT INTO product_order (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 2999.99),
(1, 3, 2, 89.90),
(2, 2, 1, 3499.00),
(2, 8, 1, 599.90),
(3, 5, 3, 45.00),
(3, 10, 1, 5499.00),
(4, 4, 1, 799.90),
(4, 7, 2, 120.00),
(5, 6, 1, 1899.00),
(5, 9, 1, 250.00);


update product set category_id = 1 where id in(1,2,8,10);
update product set category_id = 2 where id in(3,4);
update product set category_id = 3 where id in(5);
update product set category_id = 4 where id in(9,6);
update product set category_id = 5 where id in(7);
update product set description = concat(name ,' Descrição'), image_url='https://imgs.casasbahia.com.br/55058059/1g.jpg?imwidth=500', price = 17.68