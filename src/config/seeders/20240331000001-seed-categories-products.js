'use strict';

module.exports = {
  async up(queryInterface) {
    // Seed categories
    const categories = [
      {
        name: 'Bánh mặn',
        description: 'Các loại bánh mặn thơm ngon',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh mì',
        description: 'Các loại bánh mì đa dạng',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh bao',
        description: 'Bánh bao với nhiều nhân khác nhau',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Kem',
        description: 'Bánh kem với nhiều kiểu dáng đẹp mắt',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Ngọt',
        description: 'Các loại bánh ngọt thơm ngon',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mì Gối/ Sandwich',
        description: 'Bánh mì gối và sandwich đa dạng',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Bông Lan',
        description: 'Bánh bông lan mềm mịn',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Bông Lan Trứng Muối',
        description: 'Bánh bông lan trứng muối thơm ngon',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('categories', categories, {});

    // Seed products
    const products = [
      // Bánh mặn (category_id: 1)
      {
        name: 'Bánh Mỳ Thịt Xông Khói',
        description: 'Bánh mỳ với thịt xông khói thơm ngon',
        price: 25000,
        category_id: 1,
        image_url: '/images/products/1.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Donut Thit Phô Mai',
        description: 'Donut với thịt và phô mai béo ngậy',
        price: 20000,
        category_id: 1,
        image_url: '/images/products/2.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Phô Mai Bắp',
        description: 'Bánh với phô mai và bắp ngọt',
        price: 18000,
        category_id: 1,
        image_url: '/images/products/3.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pate Gà Cay',
        description: 'Bánh với pate gà cay đậm đà',
        price: 22000,
        category_id: 1,
        image_url: '/images/products/4.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Xúc Xích Mè Rang',
        description: 'Bánh với xúc xích mè rang thơm ngon',
        price: 25000,
        category_id: 1,
        image_url: '/images/products/5.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hot Dog Đức',
        description: 'Hot dog kiểu Đức thơm ngon',
        price: 30000,
        category_id: 1,
        image_url: '/images/products/6.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Đùi Gà',
        description: 'Bánh hình đùi gà thơm ngon',
        price: 28000,
        category_id: 1,
        image_url: '/images/products/7.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bông Lan Trứng Muối Gà Cay Vuông',
        description: 'Bánh bông lan trứng muối gà cay hình vuông',
        price: 35000,
        category_id: 1,
        image_url: '/images/products/8.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bông Lan Trứng Muối Gà Cay',
        description: 'Bánh bông lan trứng muối gà cay',
        price: 30000,
        category_id: 1,
        image_url: '/images/products/9.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Bông Lúa',
        description: 'Bánh bông lúa thơm ngon',
        price: 25000,
        category_id: 1,
        image_url: '/images/products/10.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mặn Hoa Mai',
        description: 'Bánh mặn hình hoa mai',
        price: 20000,
        category_id: 1,
        image_url: '/images/products/11.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pizza Lớn',
        description: 'Pizza size lớn với nhiều topping',
        price: 150000,
        category_id: 1,
        image_url: '/images/products/12.jpg',
        stock_quantity: 50,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hồ Lô Xúc Xích',
        description: 'Bánh hình hồ lô với xúc xích',
        price: 25000,
        category_id: 1,
        image_url: '/images/products/13.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bông Lan Trứng Muối',
        description: 'Bánh bông lan trứng muối',
        price: 30000,
        category_id: 1,
        image_url: '/images/products/14.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pateso',
        description: 'Bánh pate thơm ngon',
        price: 25000,
        category_id: 1,
        image_url: '/images/products/15.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Khô Thịt',
        description: 'Bánh khô với thịt thơm ngon',
        price: 20000,
        category_id: 1,
        image_url: '/images/products/16.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Que Gà Cay',
        description: 'Bánh hình que gà cay',
        price: 25000,
        category_id: 1,
        image_url: '/images/products/17.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pizza Nhỏ',
        description: 'Pizza size nhỏ với nhiều topping',
        price: 80000,
        category_id: 1,
        image_url: '/images/products/18.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mặn Vuông',
        description: 'Bánh mặn hình vuông',
        price: 20000,
        category_id: 1,
        image_url: '/images/products/19.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mặn Tròn',
        description: 'Bánh mặn hình tròn',
        price: 20000,
        category_id: 1,
        image_url: '/images/products/20.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mặn Chiên',
        description: 'Bánh mặn chiên giòn',
        price: 25000,
        category_id: 1,
        image_url: '/images/products/21.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bông Lan Mặn',
        description: 'Bánh bông lan mặn thơm ngon',
        price: 25000,
        category_id: 1,
        image_url: '/images/products/22.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Bánh mì (category_id: 2)
      {
        name: 'Bánh Mì Que',
        description: 'Bánh mì que giòn rụm',
        price: 15000,
        category_id: 2,
        image_url: '/images/products/23.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mì Heo Quay',
        description: 'Bánh mì với thịt heo quay thơm ngon',
        price: 30000,
        category_id: 2,
        image_url: '/images/products/24.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hamburger Heo Bò',
        description: 'Hamburger với thịt heo và bò',
        price: 35000,
        category_id: 2,
        image_url: '/images/products/25.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mì Thịt Xíu',
        description: 'Bánh mì với thịt xíu thơm ngon',
        price: 25000,
        category_id: 2,
        image_url: '/images/products/26.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hamburger Thịt Nướng',
        description: 'Hamburger với thịt nướng',
        price: 30000,
        category_id: 2,
        image_url: '/images/products/27.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hamburger Thịt Chả',
        description: 'Hamburger với thịt chả',
        price: 28000,
        category_id: 2,
        image_url: '/images/products/28.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mì Cá Rim',
        description: 'Bánh mì với cá rim đậm đà',
        price: 25000,
        category_id: 2,
        image_url: '/images/products/29.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mì Chà Bông',
        description: 'Bánh mì với chà bông thơm ngon',
        price: 20000,
        category_id: 2,
        image_url: '/images/products/30.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mì Ốp La 2 Trứng',
        description: 'Bánh mì với 2 trứng ốp la',
        price: 25000,
        category_id: 2,
        image_url: '/images/products/31.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mì Thịt Nướng',
        description: 'Bánh mì với thịt nướng thơm ngon',
        price: 30000,
        category_id: 2,
        image_url: '/images/products/32.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hamburger Chả Lát',
        description: 'Hamburger với chả lát',
        price: 28000,
        category_id: 2,
        image_url: '/images/products/33.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mì Thịt Chả Đặc Biệt',
        description: 'Bánh mì với thịt chả đặc biệt',
        price: 35000,
        category_id: 2,
        image_url: '/images/products/34.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Hamburger Không Nhân',
        description: 'Hamburger không nhân',
        price: 15000,
        category_id: 2,
        image_url: '/images/products/35.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mì HotDog',
        description: 'Bánh mì với xúc xích hotdog',
        price: 25000,
        category_id: 2,
        image_url: '/images/products/36.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mì Chả Thịt',
        description: 'Bánh mì với chả thịt thơm ngon',
        price: 25000,
        category_id: 2,
        image_url: '/images/products/37.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Mì Không Nhân',
        description: 'Bánh mì không nhân',
        price: 10000,
        category_id: 2,
        image_url: '/images/products/38.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Bánh bao (category_id: 3)
      {
        name: 'Bánh Bao Nhân Thịt Bò',
        description: 'Bánh bao với nhân thịt bò đậm đà',
        price: 25000,
        category_id: 3,
        image_url: '/images/products/39.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Bao Nhân Thịt Heo',
        description: 'Bánh bao với nhân thịt heo thơm ngon',
        price: 20000,
        category_id: 3,
        image_url: '/images/products/40.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Bao Nhân Dừa Chay',
        description: 'Bánh bao chay với nhân dừa',
        price: 15000,
        category_id: 3,
        image_url: '/images/products/41.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Bao Lá Dứa',
        description: 'Bánh bao lá dứa thơm ngon',
        price: 20000,
        category_id: 3,
        image_url: '/images/products/42.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Bánh Kem (category_id: 4)
      {
        name: 'Bánh Kem Nam Trái Tim',
        description: 'Bánh kem hình trái tim lãng mạn',
        price: 250000,
        category_id: 4,
        image_url: '/images/products/43.jpg',
        stock_quantity: 10,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Kem Xe Moto',
        description: 'Bánh kem hình xe moto độc đáo',
        price: 300000,
        category_id: 4,
        image_url: '/images/products/44.jpg',
        stock_quantity: 10,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Kem Mừng Thọ',
        description: 'Bánh kem mừng thọ truyền thống',
        price: 280000,
        category_id: 4,
        image_url: '/images/products/45.jpg',
        stock_quantity: 10,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Kem Hình Hello Kitty',
        description: 'Bánh kem hình Hello Kitty dễ thương',
        price: 350000,
        category_id: 4,
        image_url: '/images/products/46.jpg',
        stock_quantity: 10,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Kem Minion Nhỏ',
        description: 'Bánh kem hình Minion nhỏ xinh',
        price: 200000,
        category_id: 4,
        image_url: '/images/products/47.jpg',
        stock_quantity: 10,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Bánh Ngọt (category_id: 5)
      {
        name: 'Dừa Cuốn',
        description: 'Bánh dừa cuốn thơm ngon',
        price: 15000,
        category_id: 5,
        image_url: '/images/products/48.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Muffin Vanila',
        description: 'Muffin vanila thơm ngon',
        price: 20000,
        category_id: 5,
        image_url: '/images/products/49.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Con Ong',
        description: 'Bánh hình con ong dễ thương',
        price: 25000,
        category_id: 5,
        image_url: '/images/products/50.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bánh Con Sâu',
        description: 'Bánh hình con sâu dễ thương',
        price: 25000,
        category_id: 5,
        image_url: '/images/products/51.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Oval Dâu',
        description: 'Bánh oval với dâu tây',
        price: 30000,
        category_id: 5,
        image_url: '/images/products/52.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Bánh Mì Gối/ Sandwich (category_id: 6)
      {
        name: 'Bánh Mì Hoa Cúc',
        description: 'Bánh mì hoa cúc thơm ngon',
        price: 25000,
        category_id: 6,
        image_url: '/images/products/53.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Sandwich Lúa Mạch',
        description: 'Sandwich làm từ bột lúa mạch',
        price: 30000,
        category_id: 6,
        image_url: '/images/products/54.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Bánh Bông Lan (category_id: 7)
      {
        name: 'Bông Lan Dừa',
        description: 'Bánh bông lan với dừa thơm ngon',
        price: 25000,
        category_id: 7,
        image_url: '/images/products/55.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bông Lan Cuộng Sô Cô La',
        description: 'Bánh bông lan cuộn sô cô la',
        price: 30000,
        category_id: 7,
        image_url: '/images/products/56.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bông Lan Cuộn Môn',
        description: 'Bánh bông lan cuộn môn thơm ngon',
        price: 28000,
        category_id: 7,
        image_url: '/images/products/57.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Bánh Bông Lan Trứng Muối (category_id: 8)
      {
        name: '262BK',
        description: 'Bánh bông lan trứng muối đặc biệt',
        price: 35000,
        category_id: 8,
        image_url: '/images/products/58.jpg',
        stock_quantity: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('products', products, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
}; 