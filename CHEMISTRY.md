# IonLab — Ghi chú về mô phỏng và nội dung

Mô phỏng phục vụ quan sát trong bài học định tính anion–cation. Màu, thể tích, tốc độ, kích thước hạt tủa và thời gian đều là minh họa; hình không thể hiện phép đo hoặc thay thế quy trình phòng thí nghiệm.

## Phạm vi của sơ đồ

Các nhánh và kết luận kế thừa bản `hoaphantich-ion` tại commit `bb147fe`, trong mô hình tối đa 2 anion và tối đa 3 ion tổng cộng. Một số kết luận dùng phép loại trừ trong tập ion giới hạn, đặc biệt Mg²⁺ ở nhóm IV/V và K⁺ ở nhóm VI. Không suy rộng chúng thành phép thử khẳng định độc lập cho mẫu bất kỳ.

Nút âm tính của phép thử oxalat được giữ đúng yêu cầu: **Không có tủa hoặc tủa tan**. Hình minh họa hai khả năng này bằng hai ống riêng.

## Quy ước hình ảnh

- Dung dịch không màu dùng nền kính sáng với đường viền xanh nhạt để nhìn thấy bề mặt; sắc viền không biểu thị dung dịch màu xanh.
- Mức dung dịch trong mỗi ống bằng một nửa mức minh họa trước đây. Kết tủa mới hình thành được thể hiện bằng vẩn đục và hạt lơ lửng lan từ mặt dung dịch xuống toàn bộ phần chất lỏng, sau đó mới lắng nhẹ. Phần tủa đã ly tâm/tách riêng vẫn nằm ở đáy. Cảnh tan làm cả vẩn đục và hạt rắn biến mất. Cảnh Cl⁻ gồm có tủa → tan → tái xuất hiện.
- Bi³⁺ với KI: **tủa đen**, rồi tủa tan trong KI dư thành **dung dịch cam**. Không biến lớp tủa đen thành lớp tủa cam.
- Hg²⁺ với KI: tủa đỏ cam xuất hiện rồi tan trong KI dư.
- Br⁻ / I⁻: hai ống minh họa hai khả năng khác nhau; màu vàng cam của Br₂ hoặc tím của I₂ nằm ở lớp cloroform phía dưới.
- Mùi là tín hiệu không nhìn thấy. Nét đứt chỉ là ký hiệu mùi, không phải khói có màu. Phép acetate với ethanol tạo ethyl acetate: sửa tên “dầu chuối” của bản gốc thành “mùi este”.
- Màu cam của Griess và tím xim của Monterqui giữ theo bài học gốc. Thuốc thử Griess có thể cho sắc độ khác theo thành phần. Bản gốc không có công thức thuốc thử Monterqui, nên không tự dựng thêm dụng cụ hay thứ tự hóa chất chưa được cung cấp.
- Toàn bộ thao tác được trình bày đồng thời theo thứ tự trong một khung, không xác định kết quả tự động. Hình trên mỗi thẻ là một khả năng; chỉ khi chạm chọn thẻ hiện tượng mới ghi kết quả.

## Nguồn đối chiếu hình ảnh và hiện tượng

- [University of Wisconsin–Madison: mercury iodide precipitates and redissolves in excess iodide](https://demolab.chem.wisc.edu/general-chemistry-demonstrations-topic-page/aqueous-equilibrium-and-precipitation-reactions-orange-tornado-2/).
- [University of Colorado Boulder: iron(III)–thiocyanate is blood red](https://www.colorado.edu/lab/lecture-demo-manual/e710-complex-ion-shifting-equilibrium).
- [University of Bristol: ethyl acetate from ethanol and ethanoic acid, fruity odor](https://www.chm.bris.ac.uk/motm/ethylacetate/ethylacetateh.htm).
- [Jim Clark: halide tests using silver nitrate and ammonia](https://www.chemguide.co.uk/inorganic/group7/testing.html).
- [Tài liệu hóa phân tích định tính — L. Pataki (1980)](https://www.ndl.ethernet.edu.et/bitstream/123456789/7011/1/L.%20Pataki_1980.pdf): BiI₃ đen tan trong iodide dư thành phức màu cam đỏ.

Giảng viên có thể hiệu chỉnh quy trình và màu theo giáo trình đang dùng bằng cách sửa dữ liệu tương ứng trong `reactions.js`.
