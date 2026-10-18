# GachTheWibu

Bộ mã nguồn khởi đầu cho website gạch thẻ công khai, giao diện trắng-xanh, ưu tiên di động.

## Tình trạng hiện tại

- Có giao diện trang chủ, đăng ký/đăng nhập, SQLite lưu tài khoản, lịch sử giao dịch và endpoint quản trị cơ bản.
- Endpoint gạch thẻ **từ chối an toàn** khi chưa cấu hình và triển khai adapter API chính thức. Không giả lập giao dịch thành công.
- Chưa thể xử lý thẻ thật cho đến khi có hợp đồng/tài khoản API từ nhà cung cấp và adapter được tích hợp, kiểm thử.

## Chạy thử trên máy tính

Cần cài Node.js 20 trở lên.

1. Sao chép `.env.example` thành `.env`.
2. Đặt `JWT_SECRET` thành chuỗi ngẫu nhiên dài ít nhất 32 ký tự.
3. Đổi `ADMIN_EMAIL` và `ADMIN_PASSWORD` trước lần chạy đầu tiên.
4. Chạy:
   ```bash
   npm install
   npm start
   ```
5. Mở `http://localhost:3000`.

Tài khoản quản trị được tạo khi khởi động lần đầu nếu có `ADMIN_EMAIL` và `ADMIN_PASSWORD` hợp lệ trong `.env`. Đừng để mật khẩu mẫu trên máy chủ công khai.

## Trước khi đưa lên internet

- Dùng HTTPS, máy chủ được bảo trì và sao lưu dữ liệu.
- Dùng dịch vụ email xác minh/khôi phục mật khẩu; thêm điều khoản, chính sách riêng tư và thông tin đơn vị vận hành.
- Kết nối nhà cung cấp API hợp pháp bằng adapter phía máy chủ, kiểm tra chữ ký callback, chống giao dịch trùng (idempotency), giới hạn tần suất, nhật ký kiểm toán và quy trình hoàn tiền.
- Không lưu mã thẻ/seri thô. Bản hiện tại không lưu thông tin thẻ và không gửi thẻ đi khi chưa có adapter.
- Thêm quy trình xác minh quản trị viên, bảo vệ CSRF phù hợp, giám sát, cảnh báo và kiểm thử bảo mật trước khi vận hành công khai.
- Không tự nhận hoặc giữ tiền khách hàng nếu chưa đáp ứng các yêu cầu pháp lý và thanh toán áp dụng.

## Cấu hình API

Không có một API chung cho mọi nhà cung cấp. Cần lấy tài liệu chính thức, khóa API và quy định chiết khấu/thanh toán của nhà cung cấp đã duyệt tài khoản. Sau đó triển khai hàm `submitToProvider` trong `server.js` theo đúng tài liệu của họ. Không đưa khóa bí mật vào thư mục `public` hoặc JavaScript chạy trên trình duyệt.
