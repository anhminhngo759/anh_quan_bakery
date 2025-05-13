'use strict';

module.exports = {
  async up(queryInterface) {
    // Seed news table
    const newsItems = [
      {
        title: 'Khai trương chi nhánh mới tại Quận 1',
        slug: 'khai-truong-chi-nhanh-moi-tai-quan-1',
        summary: 'Anh Quân Bakery vừa khai trương chi nhánh mới tại trung tâm Quận 1, TP. Hồ Chí Minh.',
        content: '<p>Anh Quân Bakery vừa khai trương chi nhánh mới tại trung tâm Quận 1, TP. Hồ Chí Minh. Với không gian rộng rãi, thoáng mát cùng thực đơn phong phú, chi nhánh mới hứa hẹn sẽ mang đến trải nghiệm tuyệt vời cho khách hàng.</p><p>Chi nhánh mới được thiết kế theo phong cách hiện đại, kết hợp giữa không gian ấm cúng và sang trọng. Đây là chi nhánh thứ 5 của Anh Quân Bakery tại TP. Hồ Chí Minh, đánh dấu bước phát triển mới của thương hiệu.</p><p>Nhân dịp khai trương, Anh Quân Bakery áp dụng chương trình ưu đãi đặc biệt: giảm 20% cho tất cả các sản phẩm và tặng 1 bánh kem nhỏ cho 50 khách hàng đầu tiên mỗi ngày trong tuần khai trương.</p>',
        image: '/images/news/news1.jpg',
        author_id: 1,
        is_published: true,
        published_at: new Date('2023-12-15 08:00:00'),
        created_at: new Date('2023-12-10 08:00:00'),
        updated_at: new Date('2023-12-15 08:00:00')
      },
      {
        title: 'Ra mắt dòng sản phẩm bánh mì đen tốt cho sức khỏe',
        slug: 'ra-mat-dong-san-pham-banh-mi-den-tot-cho-suc-khoe',
        summary: 'Anh Quân Bakery vừa cho ra mắt dòng sản phẩm bánh mì đen tốt cho sức khỏe, giàu dinh dưỡng.',
        content: '<p>Anh Quân Bakery vừa cho ra mắt dòng sản phẩm bánh mì đen tốt cho sức khỏe, giàu dinh dưỡng. Bánh mì đen được làm từ bột mì nguyên cám, giàu chất xơ và các dưỡng chất thiết yếu, là lựa chọn lý tưởng cho những người quan tâm đến sức khỏe và vóc dáng.</p><p>Bánh mì đen của Anh Quân Bakery được làm từ nguyên liệu tự nhiên, không chứa phẩm màu hay chất bảo quản. Quy trình làm bánh cũng được kiểm soát chặt chẽ để đảm bảo chất lượng tốt nhất cho sản phẩm.</p><p>Hiện nay, dòng sản phẩm bánh mì đen đã có mặt tại tất cả các chi nhánh của Anh Quân Bakery và nhận được phản hồi tích cực từ khách hàng.</p>',
        image: '/images/news/news2.jpg',
        author_id: 1,
        is_published: true,
        published_at: new Date('2023-11-20 09:30:00'),
        created_at: new Date('2023-11-15 09:30:00'),
        updated_at: new Date('2023-11-20 09:30:00')
      },
      {
        title: 'Chương trình khuyến mãi nhân dịp Giáng sinh và Năm mới',
        slug: 'chuong-trinh-khuyen-mai-nhan-dip-giang-sinh-va-nam-moi',
        summary: 'Anh Quân Bakery triển khai chương trình khuyến mãi đặc biệt nhân dịp Giáng sinh và Năm mới.',
        content: '<p>Anh Quân Bakery triển khai chương trình khuyến mãi đặc biệt nhân dịp Giáng sinh và Năm mới. Khi mua các sản phẩm bánh Giáng sinh và Năm mới, khách hàng sẽ được tặng voucher giảm giá 20% cho lần mua hàng tiếp theo. Chương trình áp dụng từ ngày 15/12/2023 đến hết ngày 15/01/2024.</p><p>Bên cạnh đó, Anh Quân Bakery còn tung ra bộ sưu tập bánh ngọt theo chủ đề Giáng sinh với nhiều hương vị độc đáo như bánh khúc cây chocolate, bánh quy gừng, bánh pudding trái cây,...</p><p>Đặc biệt, khi đặt bánh kem Giáng sinh trước ngày 20/12, khách hàng sẽ được giảm giá 15% và miễn phí giao hàng trong phạm vi nội thành.</p>',
        image: '/images/news/news3.jpg',
        author_id: 1,
        is_published: true,
        published_at: new Date('2023-12-10 10:15:00'),
        created_at: new Date('2023-12-05 10:15:00'),
        updated_at: new Date('2023-12-10 10:15:00')
      },
      {
        title: 'Workshop làm bánh cho trẻ em nhân ngày Quốc tế Thiếu nhi',
        slug: 'workshop-lam-banh-cho-tre-em-nhan-ngay-quoc-te-thieu-nhi',
        summary: 'Anh Quân Bakery tổ chức workshop làm bánh cho trẻ em nhân ngày Quốc tế Thiếu nhi 1/6.',
        content: '<p>Anh Quân Bakery tổ chức workshop làm bánh cho trẻ em nhân ngày Quốc tế Thiếu nhi 1/6. Tại đây, các em nhỏ được hướng dẫn làm bánh cookies, cupcake và trang trí bánh theo ý thích. Đây là hoạt động ý nghĩa nhằm khơi dậy niềm đam mê làm bánh và sự sáng tạo cho trẻ em.</p><p>Workshop được tổ chức tại tất cả các chi nhánh của Anh Quân Bakery với sự hướng dẫn của các đầu bếp chuyên nghiệp. Sau khi hoàn thành, các em sẽ được mang những sản phẩm do chính tay mình làm ra về nhà.</p><p>Phí tham gia workshop chỉ từ 150.000 đồng/trẻ, bao gồm tất cả nguyên liệu và dụng cụ làm bánh. Phụ huynh có thể đăng ký cho con em mình tham gia thông qua website hoặc trực tiếp tại các cửa hàng.</p>',
        image: '/images/news/news4.jpg',
        author_id: 1,
        is_published: true,
        published_at: new Date('2023-05-25 14:00:00'),
        created_at: new Date('2023-05-20 14:00:00'),
        updated_at: new Date('2023-05-25 14:00:00')
      },
      {
        title: 'Áp dụng công nghệ mới trong sản xuất bánh',
        slug: 'ap-dung-cong-nghe-moi-trong-san-xuat-banh',
        summary: 'Anh Quân Bakery áp dụng công nghệ mới trong sản xuất bánh, nâng cao chất lượng sản phẩm.',
        content: '<p>Anh Quân Bakery áp dụng công nghệ mới trong sản xuất bánh, nâng cao chất lượng sản phẩm. Công nghệ mới giúp kiểm soát nhiệt độ và độ ẩm chính xác, đảm bảo bánh luôn đạt chất lượng tốt nhất. Ngoài ra, công nghệ này còn giúp tiết kiệm năng lượng, góp phần bảo vệ môi trường.</p><p>Cụ thể, Anh Quân Bakery đã đầu tư hệ thống lò nướng thông minh với công nghệ điều khiển nhiệt và độ ẩm tự động, giúp bánh chín đều và giữ được hương vị tự nhiên. Bên cạnh đó, hệ thống bảo quản bánh với công nghệ kiểm soát nhiệt độ và độ ẩm cũng được áp dụng, giúp bánh luôn giữ được độ tươi ngon.</p><p>Với những đầu tư này, Anh Quân Bakery cam kết mang đến những sản phẩm chất lượng cao nhất cho khách hàng, đồng thời góp phần bảo vệ môi trường thông qua việc giảm tiêu thụ năng lượng trong quá trình sản xuất.</p>',
        image: '/images/news/news5.jpg',
        author_id: 1,
        is_published: true,
        published_at: new Date('2023-10-05 11:30:00'),
        created_at: new Date('2023-10-01 11:30:00'),
        updated_at: new Date('2023-10-05 11:30:00')
      },
      {
        title: 'Anh Quân Bakery nhận giải thưởng "Thương hiệu bánh được yêu thích nhất"',
        slug: 'anh-quan-bakery-nhan-giai-thuong-thuong-hieu-banh-duoc-yeu-thich-nhat',
        summary: 'Anh Quân Bakery vinh dự nhận giải thưởng "Thương hiệu bánh được yêu thích nhất" năm 2023.',
        content: '<p>Anh Quân Bakery vinh dự nhận giải thưởng "Thương hiệu bánh được yêu thích nhất" năm 2023. Giải thưởng này là sự ghi nhận cho những nỗ lực không ngừng của Anh Quân Bakery trong việc mang đến những sản phẩm chất lượng và dịch vụ tốt nhất cho khách hàng. Đây là động lực để chúng tôi tiếp tục phát triển và hoàn thiện hơn nữa trong tương lai.</p><p>Giải thưởng được bình chọn bởi hơn 10.000 khách hàng thông qua khảo sát trực tuyến và đánh giá tại cửa hàng. Theo kết quả khảo sát, Anh Quân Bakery được đánh giá cao về chất lượng sản phẩm, dịch vụ khách hàng và không gian cửa hàng.</p><p>Nhân dịp này, Anh Quân Bakery xin gửi lời cảm ơn chân thành đến tất cả khách hàng đã ủng hộ và đồng hành cùng chúng tôi trong suốt thời gian qua. Chúng tôi cam kết sẽ tiếp tục nỗ lực để mang đến những trải nghiệm tốt nhất cho khách hàng.</p>',
        image: '/images/news/news6.jpg',
        author_id: 1,
        is_published: true,
        published_at: new Date('2023-09-15 13:45:00'),
        created_at: new Date('2023-09-10 13:45:00'),
        updated_at: new Date('2023-09-15 13:45:00')
      }
    ];

    await queryInterface.bulkInsert('news', newsItems, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('news', null, {});
  }
}; 