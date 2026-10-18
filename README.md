# PromptForge — ByDuyuDev

Website thư viện prompt phong cách gaming, xây dựng bằng React + Vite.

## Chạy trên Windows

1. Cài Node.js bản LTS từ https://nodejs.org/
2. Giải nén dự án và mở thư mục bằng VS Code.
3. Mở Terminal tại thư mục dự án, chạy:

```bash
npm install
```

4. Sao chép `.env.example` thành `.env` rồi đặt `VITE_ADMIN_PASSWORD` thành mật khẩu demo của bạn.
5. Chạy website:

```bash
npm run dev
```

6. Mở địa chỉ local mà Vite hiển thị, thường là `http://localhost:5173`.

## Tính năng hiện có

- Giao diện responsive, dark gaming/neon.
- Tìm kiếm và lọc prompt theo danh mục.
- Copy toàn bộ prompt.
- Xem nội dung prompt trước khi copy.
- Khu vực admin demo để thêm, sửa, xóa prompt.
- Lưu prompt trong localStorage của trình duyệt.

## Quan trọng về bảo mật

Đây là **bản frontend demo**. Mật khẩu `VITE_ADMIN_PASSWORD` được đưa vào bundle frontend khi build, vì vậy người dùng có kỹ thuật có thể xem được; nó KHÔNG bảo vệ dữ liệu thật. Dữ liệu `localStorage` chỉ tồn tại trên trình duyệt đang dùng và không đồng bộ giữa thiết bị.

Trước khi triển khai công khai, hãy chuyển đăng nhập admin sang backend có xác thực thật (ví dụ Supabase Auth), bật Row Level Security cho bảng prompt/admin, và chỉ cho tài khoản admin được phép ghi dữ liệu. Không lưu mật khẩu admin thật trong biến `VITE_*`. Hãy cấu hình URL Group Chat và Group Thông Báo trong `src/App.jsx` trước khi public.

## Tùy chỉnh liên hệ

- Gmail hiện đặt là `duyudev123@gmail.com`; đổi trong `src/App.jsx` nếu cần.
- Tìm hai đường dẫn có `href="#"` ở phần footer và thay bằng link Group Chat / Group Thông Báo thực tế.
- Thương hiệu: `© 2026 ByDuyuDev`.
