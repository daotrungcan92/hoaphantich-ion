# IonLab — Hóa phân tích trực quan

Ứng dụng tĩnh tiếng Việt cho sơ đồ định tính anion–cation. Không cần cài thư viện để chạy. Mở `index.html` trực tiếp hoặc phục vụ thư mục qua máy chủ tĩnh.

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Mở http://127.0.0.1:4173/.

- `reactions.js`: từng bước, thao tác, các hiện tượng, nhánh đi tiếp và quy tắc tương kỵ kế thừa.
- `scenes.js`: hình SVG và ánh xạ cảnh tường minh. Mọi hình đều tạo tại máy, không dùng video ngoài.
- `app.js`: điều hướng, khung thao tác tổng hợp, kết quả, khôi phục bước trước, nhật ký và giảm chuyển động.
- `styles.css`: giao diện đáp ứng và các hoạt ảnh.
- `CHEMISTRY.md`: phạm vi mô hình và nguồn đối chiếu hiện tượng.

Font Google Fonts là tùy chọn; khi không có mạng, ứng dụng dùng Arial. Không có thu thập dữ liệu, máy chủ xử lý mẫu hoặc tài khoản đăng nhập. Kết quả chỉ tồn tại trong phiên trang hiện tại; tải lại trang sẽ bắt đầu mẫu mới.

Nhánh phát triển: `codex/phat-trien-giao-dien`. Chỉ cập nhật nhánh triển khai sau khi người dùng duyệt bản xem trước.

Giao diện mở thẳng vào bài thực hành. Toàn bộ thao tác của phép thử luôn hiện đồng thời trong một khung chung, theo đúng thứ tự. Máy tính xếp hình và hướng dẫn thành các cột; điện thoại xếp thành các hàng ngắn với hình bên trái và chữ bên phải. Hoạt ảnh chạy tại chỗ, không có bộ đếm chuyển trang hoặc bộ hẹn giờ thay hướng dẫn. Phát lại chỉ khởi động lại hoạt ảnh; tạm dừng, giảm chuyển động, trang ở nền và hộp mẫu mới vẫn giữ nguyên toàn bộ hướng dẫn. Phông chữ ngoài tải tùy chọn, không chặn giao diện.

Các hiện tượng hiển thị trực tiếp trên thẻ lớn; chạm vào bất kỳ vị trí nào của thẻ sẽ chọn hiện tượng. Bản điện thoại tăng cỡ chữ, ưu tiên hình và thao tác chọn; các hình hai ống dùng cả chiều ngang màn hình.

Thẻ hiện tượng không có nút mũi tên hoặc nút xem trước riêng; toàn bộ thẻ là vùng chọn. Vẩn đục và hạt tủa có độ tương phản cao để dễ quan sát trên điện thoại.

Các lựa chọn “tủa không tan”/“tủa bền” hiển thị tủa có sẵn và giữ nguyên, không chạy lại hiệu ứng tạo tủa. Cảnh thêm thuốc thử vào phần tủa có sẵn cũng bắt đầu với tủa hiện đầy đủ.
