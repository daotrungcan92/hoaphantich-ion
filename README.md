# IonLab — Hóa phân tích trực quan

Ứng dụng tĩnh tiếng Việt cho sơ đồ định tính anion–cation. Không cần cài thư viện để chạy. Mở `index.html` trực tiếp hoặc phục vụ thư mục qua máy chủ tĩnh.

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Mở http://127.0.0.1:4173/.

- `reactions.js`: từng bước, thao tác, các hiện tượng, nhánh đi tiếp và quy tắc tương kỵ kế thừa.
- `scenes.js`: hình SVG và ánh xạ cảnh tường minh. Mọi hình đều tạo tại máy, không dùng video ngoài.
- `app.js`: điều hướng, xem trước, kết quả, khôi phục bước trước, nhật ký và giảm chuyển động.
- `styles.css`: giao diện đáp ứng và các hoạt ảnh.
- `CHEMISTRY.md`: phạm vi mô hình và nguồn đối chiếu hiện tượng.

Font Google Fonts là tùy chọn; khi không có mạng, ứng dụng dùng Arial. Không có thu thập dữ liệu, máy chủ xử lý mẫu hoặc tài khoản đăng nhập. Kết quả chỉ tồn tại trong phiên trang hiện tại; tải lại trang sẽ bắt đầu mẫu mới.

Nhánh phát triển: `codex/phat-trien-giao-dien`. Chỉ cập nhật nhánh triển khai sau khi người dùng duyệt bản xem trước.
