-- Tabela para a classe 'Category'
CREATE TABLE category (
    id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(255)
);

-- Tabela para a classe 'User'
CREATE TABLE "users" (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabela para a classe 'Address'
CREATE TABLE address (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    street VARCHAR(255),
    complement VARCHAR(255),
    zip_code VARCHAR(255),
    city VARCHAR(255),
    address_state VARCHAR(255),
    country VARCHAR(255),
    address_number VARCHAR(255),
    is_default BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES "users"(id)
);

-- Tabela para a classe 'Order'
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    date_time TIMESTAMP,
    user_id BIGINT,
    status VARCHAR(255),
    address_id BIGINT,
    payment_method VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES "users"(id),
    FOREIGN KEY (address_id) REFERENCES "address"(id)
);

-- Tabela para a classe 'Product' 

CREATE TABLE product (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
	description VARCHAR(255),
	image_url VARCHAR(255),
	price NUMERIC,
	category_id BIGINT,
	CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE product_order (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    quantity INTEGER,
    price NUMERIC(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES "product"(id)
);