# Hướng dẫn cài đặt fCMAS
fCMAS bao gồm các phần:
* Database: MySQL
* Back-end: AdonisJS + Lucid Model
* APIs: InertiaJS (client-server bridge)
* Front-end: Vue3 + Vuero theme
* Build tool: Vite

Cài đặt fCMAS theo các bước sau:
1. Cài Docker, Node.js
2. Kéo git về, chuyển sang nhánh dev
3. Mở terminal, cd vào thư mục vừa kéo về là fcmas rồi chạy lệnh "docker compose up -d"
4. Tạo file .env, copy nội dung từ .env.example bỏ vào
5. Chạy lệnh "npm i" để cài đặt đặt các package
6. Chạy lệnh "node ace migration:refresh --seed" để tạo các bảng và thêm 1 số data mẫu
7. Chạy lênh npm run dev
8. Xem kết quả tại trang [http://localhost:3333](http://localhost:3333)
9. Tài khoản login xem trong file fcmas/database/seeders/user_seeder.ts

Các link hỗ trợ:
* [Link cài Docker](https://www.docker.com)
* [Link cài NodeJS](https://nodejs.org/en)
* [Link Github](https://github.com/linhtc/fcmas)
* [Link AdonisJS](https://adonisjs.com)
* [Link Lucid](https://lucid.adonisjs.com/docs/introduction)
* [Link Inertia](https://inertiajs.com)
* [Link Vuero](https://vuero.cssninja.io)
* [Link Vite](https://vite.dev)
