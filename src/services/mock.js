const express = require('express');
const app = express();
const port = 3001; // Port mặc định cho mock API

// Middleware để hỗ trợ JSON
app.use(express.json());

// Dữ liệu giả định
const mockData = {
  banner: {
    imageUrl: 'https://teeholic.s3.amazonaws.com/wp-content/uploads/2024/11/2-1.webp',
  },
  promoImage: {
    imageUrl: 'https://via.placeholder.com/1200x300?text=Khuyen+Mai+Dac+Biet',
  },
  categories: [
    { id: 1, name: 'Nam', image: 'https://via.placeholder.com/400x300?text=Nam', slug: 'men' },
    { id: 2, name: 'Nữ', image: 'https://via.placeholder.com/400x300?text=Nu', slug: 'women' },
    { id: 3, name: 'Túi Xách', image: 'https://via.placeholder.com/400x300?text=Tui+Xach', slug: 'handbags' },
    { id: 4, name: 'Giày', image: 'https://via.placeholder.com/400x300?text=Giay', slug: 'shoes' },
    { id: 5, name: 'Phụ Kiện', image: 'https://via.placeholder.com/400x300?text=Phu+Kien', slug: 'accessories' },
  ],
  products: [
    { id: 1, image: 'https://via.placeholder.com/300x400?text=Sweatshirt', name: 'Sweatshirt', code: 'SW001', price: 250000 },
    { id: 2, image: 'https://via.placeholder.com/300x400?text=T-Shirt', name: 'T-Shirt', code: 'TS001', price: 150000 },
    { id: 3, image: 'https://via.placeholder.com/300x400?text=Hoodie', name: 'Hoodie', code: 'HD001', price: 300000 },
    { id: 4, image: 'https://via.placeholder.com/300x400?text=Mug', name: 'Mug', code: 'MG001', price: 80000 },
    { id: 5, image: 'https://via.placeholder.com/300x400?text=Canvas', name: 'Canvas', code: 'CV001', price: 200000 },
    { id: 6, image: 'https://via.placeholder.com/300x400?text=Hats', name: 'Hats', code: 'HT001', price: 120000 },
    { id: 7, image: 'https://via.placeholder.com/300x400?text=Socks', name: 'Socks', code: 'SK001', price: 50000 },
  ],
};

// Endpoint cho banner
app.get('/api/banner', (req, res) => {
  res.json(mockData.banner);
});

// Endpoint cho ảnh quảng cáo
app.get('/api/promo-image', (req, res) => {
  res.json(mockData.promoImage);
});

// Endpoint cho danh mục
app.get('/api/categories', (req, res) => {
  res.json(mockData.categories);
});

// Endpoint cho sản phẩm
app.get('/api/products', (req, res) => {
  res.json(mockData.products);
});

// Khởi động server
app.listen(port, () => {
  console.log(`Mock API chạy tại http://localhost:${port}`);
});