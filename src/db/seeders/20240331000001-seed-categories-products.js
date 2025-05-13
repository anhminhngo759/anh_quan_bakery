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
        image_url: '/uploads/bnh__m__tht__xng__khi-1744121749936-110959154.png',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__tht__xng__khi-1744121749936-110959154.png',
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
        image_url: '/uploads/donut__thit__ph__mai-1744121295824-596121205.png',
        thumbnail_url: '/uploads/thumbnails/thumb-donut__thit__ph__mai-1744121295824-596121205.png',
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
        image_url: '/uploads/ph__mai__bp-1744121348198-132605622.png',
        thumbnail_url: '/uploads/thumbnails/thumb-ph__mai__bp-1744121348198-132605622.png',
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
        image_url: '/uploads/pate__g__cay-1744121372439-761059223.png',
        thumbnail_url: '/uploads/thumbnails/thumb-pate__g__cay-1744121372439-761059223.png',
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
        image_url: '/uploads/xc__xch__m__rang-1744121390474-58285705.png',
        thumbnail_url: '/uploads/thumbnails/thumb-xc__xch__m__rang-1744121390474-58285705.png',
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
        image_url: '/uploads/hot__dog_c-1744121407255-800138355.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-hot__dog_c-1744121407255-800138355.jpg',
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
        image_url: '/uploads/bnh_i__g-1744121421740-853768241.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh_i__g-1744121421740-853768241.jpg',
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
        image_url: '/uploads/bng__lan__trng__mui__g__cay__vung-1744121484713-47463191.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bng__lan__trng__mui__g__cay__vung-1744121484713-47463191.jpg',
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
        image_url: '/uploads/bng__lan__trng__mui__g__cay-1744121511225-892315292.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bng__lan__trng__mui__g__cay-1744121511225-892315292.jpg',
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
        image_url: '/uploads/bnh__bng__la-1744121529118-196511132.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__bng__la-1744121529118-196511132.jpg',
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
        image_url: '/uploads/bnh__mn__hoa__mai-1744121547454-672670302.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__mn__hoa__mai-1744121547454-672670302.jpg',
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
        image_url: '/uploads/pizza__ln-1744121678160-446926585.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-pizza__ln-1744121678160-446926585.jpg',
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
        image_url: '/uploads/h__l__xc__xch-1744121695720-744707868.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-h__l__xc__xch-1744121695720-744707868.jpg',
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
        image_url: '/uploads/bng__lan__trng__mui-1744121715667-28274393.png',
        thumbnail_url: '/uploads/thumbnails/thumb-bng__lan__trng__mui-1744121715667-28274393.png',
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
        image_url: '/uploads/pateso-1744121734435-759221969.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-pateso-1744121734435-759221969.jpg',
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
        image_url: '/uploads/bnh__kh__tht-1744121276250-178517269.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__kh__tht-1744121276250-178517269.jpg',
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
        thumbnail_url: null,
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
        image_url: '/uploads/pizza__nh-1744121832518-594330701.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-pizza__nh-1744121832518-594330701.jpg',
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
        image_url: '/uploads/bnh__mn__vung-1744121863931-680750628.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__mn__vung-1744121863931-680750628.jpg',
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
        image_url: '/uploads/bnh__mn__trn-1744121879712-507997716.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__mn__trn-1744121879712-507997716.jpg',
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
        image_url: '/uploads/bnh__mn__chin-1744121892298-463832421.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__mn__chin-1744121892298-463832421.jpg',
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
        image_url: '/uploads/bng__lan__mn-1744121908667-176411372.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bng__lan__mn-1744121908667-176411372.jpg',
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
        image_url: '/uploads/bnh__m__que-1744121930691-686669225.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__que-1744121930691-686669225.jpg',
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
        image_url: '/uploads/bnh__m__heo__quay-1744121945451-348565085.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__heo__quay-1744121945451-348565085.jpg',
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
        image_url: '/uploads/hamburger__heo__b-1744121960230-336099580.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-hamburger__heo__b-1744121960230-336099580.jpg',
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
        image_url: '/uploads/bnh__m__tht__xu-1744121978383-298098834.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__tht__xu-1744121978383-298098834.jpg',
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
        image_url: '/uploads/hamburger__tht__nng-1744121993635-773717625.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-hamburger__tht__nng-1744121993635-773717625.jpg',
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
        image_url: '/uploads/hamburger__tht__ch-1744122018146-628318091.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-hamburger__tht__ch-1744122018146-628318091.jpg',
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
        image_url: '/uploads/bnh__m__c__rim-1744122032753-927589005.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__c__rim-1744122032753-927589005.jpg',
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
        image_url: '/uploads/bnh__m__ch__bng-1744122187571-170176148.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__ch__bng-1744122187571-170176148.jpg',
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
        image_url: '/uploads/bnh__m_p__la_2__trng-1744120912808-444520964.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m_p__la_2__trng-1744120912808-444520964.jpg',
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
        image_url: '/uploads/bnh__m__tht__nng-1744120707795-599195222.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__tht__nng-1744120707795-599195222.jpg',
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
        image_url: '/uploads/hamburger__ch__lt-1744120726903-59756007.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-hamburger__ch__lt-1744120726903-59756007.jpg',
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
        image_url: '/uploads/bnh__m__tht__ch_c__bit-1744120889489-551723909.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__tht__ch_c__bit-1744120889489-551723909.jpg',
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
        image_url: '/uploads/bnh__hamburger__khng__nhn-1744120867952-877267034.png',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__hamburger__khng__nhn-1744120867952-877267034.png',
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
        image_url: '/uploads/bnh__m__hot_dog-1744120791839-957256517.png',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__hot_dog-1744120791839-957256517.png',
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
        image_url: '/uploads/bnh__m__ch__tht-1744120561503-298128035.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__ch__tht-1744120561503-298128035.jpg',
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
        image_url: '/uploads/bnh__m__khng__nhn-1744120692331-131258151.png',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__khng__nhn-1744120692331-131258151.png',
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
        image_url: '/uploads/bnh__bao__nhn__tht__b-1744120679858-427405152.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__bao__nhn__tht__b-1744120679858-427405152.jpg',
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
        image_url: '/uploads/bnh__bao__nhn__tht__heo-1744120665928-376037848.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__bao__nhn__tht__heo-1744120665928-376037848.jpg',
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
        image_url: '/uploads/bnh__bao__nhn__da__chay-1744120644448-293452230.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__bao__nhn__da__chay-1744120644448-293452230.jpg',
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
        image_url: '/uploads/bnh__bao__l__da-1744120628399-192230759.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__bao__l__da-1744120628399-192230759.jpg',
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
        image_url: '/uploads/bnh__kem__nam__tri__tim-1744120611269-765112760.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__kem__nam__tri__tim-1744120611269-765112760.jpg',
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
        image_url: '/uploads/bnh__kem__xe__moto-1744120595297-537112743.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__kem__xe__moto-1744120595297-537112743.jpg',
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
        image_url: '/uploads/bnh__kem__mng__th-1744120752858-329154463.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__kem__mng__th-1744120752858-329154463.jpg',
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
        image_url: '/uploads/bnh__kem__hnh__hello__kitty-1744122124722-75154991.png',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__kem__hnh__hello__kitty-1744122124722-75154991.png',
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
        image_url: '/uploads/bnh__kem__minion__nh-1744122142608-774954308.png',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__kem__minion__nh-1744122142608-774954308.png',
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
        image_url: '/uploads/da__cun-1744122242750-570674598.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-da__cun-1744122242750-570674598.jpg',
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
        image_url: '/uploads/muffin__vanila-1744122075278-239592843.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-muffin__vanila-1744122075278-239592843.jpg',
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
        image_url: '/uploads/bnh__con__ong-1744120932019-366208628.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__con__ong-1744120932019-366208628.jpg',
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
        image_url: '/uploads/bnh__con__su-1744120948052-135769016.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__con__su-1744120948052-135769016.jpg',
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
        image_url: '/uploads/oval__du-1744120965553-573616735.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-oval__du-1744120965553-573616735.jpg',
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
        image_url: '/uploads/bnh__m__hoa__cc-1744121018595-19576634.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bnh__m__hoa__cc-1744121018595-19576634.jpg',
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
        image_url: '/uploads/sandwich__la__mch-1744121045068-814975176.png',
        thumbnail_url: '/uploads/thumbnails/thumb-sandwich__la__mch-1744121045068-814975176.png',
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
        image_url: '/uploads/bng__lan__da-1744121076619-505161563.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bng__lan__da-1744121076619-505161563.jpg',
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
        image_url: '/uploads/bng__lan__cung__s__c__la-1744121136697-703506696.png',
        thumbnail_url: '/uploads/thumbnails/thumb-bng__lan__cung__s__c__la-1744121136697-703506696.png',
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
        image_url: '/uploads/bng__lan__cun__mn-1744121158748-881629924.jpg',
        thumbnail_url: '/uploads/thumbnails/thumb-bng__lan__cun__mn-1744121158748-881629924.jpg',
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
        image_url: '/uploads/262_b_k-1744121182013-686699030.png',
        thumbnail_url: '/uploads/thumbnails/thumb-262_b_k-1744121182013-686699030.png',
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