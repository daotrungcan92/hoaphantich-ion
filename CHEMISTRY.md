# IonLab — Ghi chú về mô phỏng và nội dung

Mô phỏng phục vụ quan sát trong bài học định tính anion–cation. Màu, thể tích, tốc độ, kích thước hạt tủa và thời gian đều là minh họa; hình không thể hiện phép đo hoặc thay thế quy trình phòng thí nghiệm.

## Phạm vi của sơ đồ

Các nhánh và kết luận kế thừa bản `hoaphantich-ion` tại commit `bb147fe`, trong mô hình tối đa 2 anion và tối đa 3 ion tổng cộng. Một số kết luận dùng phép loại trừ trong tập ion giới hạn, đặc biệt Mg²⁺ ở nhóm IV/V và K⁺ ở nhóm VI. Không suy rộng chúng thành phép thử khẳng định độc lập cho mẫu bất kỳ.

Nút âm tính của phép thử oxalat được giữ đúng yêu cầu: **Không có tủa hoặc tủa tan**. Hình minh họa hai khả năng này bằng hai ống riêng.

## Quy ước hình ảnh

- Dung dịch không màu dùng nền kính sáng với đường viền xanh nhạt để nhìn thấy bề mặt; sắc viền không biểu thị dung dịch màu xanh.
- Mức dung dịch trong mỗi ống bằng một nửa mức minh họa trước đây. Kết tủa mới hình thành được thể hiện bằng mảng vẩn đục loang và bông tủa có mép không đều, không dùng vòng tròn hoặc viền rỗng như bọt khí; các bông tủa lơ lửng lan từ mặt dung dịch xuống toàn bộ phần chất lỏng, sau đó mới lắng nhẹ. Phần tủa đã ly tâm/tách riêng vẫn nằm ở đáy. Cảnh tan làm cả vẩn đục và hạt rắn biến mất. Cảnh Cl⁻ gồm có tủa → tan → tái xuất hiện.
- Bi³⁺ với KI: **tủa đen**, rồi tủa tan trong KI dư thành **dung dịch cam**. Không biến lớp tủa đen thành lớp tủa cam.
- Hg²⁺ với KI: tủa đỏ cam xuất hiện rồi tan trong KI dư.
- Br⁻ / I⁻: hai thẻ dương tính riêng biệt, mỗi thẻ minh họa một ống. Lớp cloroform phía dưới vàng cam (Br₂) ghi kết quả Br⁻; lớp này tím (I₂) ghi kết quả I⁻. Thẻ âm tính không có màu đặc trưng. Sổ tay, thông báo và tổng kết chỉ ghi ion đã chọn, không ghi gộp Br⁻ / I⁻.
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

## Học liệu gắn với hiện tượng

`explanations.js` bổ sung giải thích tùy chọn cho từng kết quả quan sát, bao gồm kết quả âm tính và thử độ tan. Mở dấu ! chỉ đọc học liệu; không tự xác định hoặc ghi nhận ion. Nội dung được tách khỏi điều hướng và không thay đổi quy trình cũ.

- Các phương trình dùng dạng ion rút gọn khi phù hợp. Dấu ↓ chỉ chất rắn kết tủa, ↑ chỉ khí thoát ra. Các ví dụ, sơ đồ cơ chế và mô hình giản lược đều có chú thích; không gán một phương trình duy nhất cho hiện tượng có nhiều nguyên nhân.
- Griess: phân biệt nitrit tạo màu trực tiếp với nitrat phải khử đến nitrit. Màu phụ thuộc thuốc thử; bản gốc chưa nêu công thức Griess A/B, nên chỉ trình bày sơ đồ diazot hóa–ghép cặp, không tự dựng cấu trúc phẩm màu. [FDA — Nitrite Detection Reagents](https://www.fda.gov/food/laboratory-methods-food/bam-r48-nitrite-detection-reagents), [báo cáo nghiên cứu về khử nitrat bằng Zn](https://ntrl.ntis.gov/NTRL/dashboard/searchResults/titleDetail/AD648942.xhtml).
- Phân biệt carbonat/hydrocarbonat bằng Mg²⁺ phải dùng mẫu mới và đúng điều kiện nhiệt độ. MgCO₃ trong phương trình là mô hình giản lược; tủa thực tế phụ thuộc điều kiện. [Mustansiriyah University — bài thực hành carbonat/hydrocarbonat](https://uomustansiriyah.edu.iq/media/lectures/3/3_2024_09_24%2110_01_55_PM.pdf).
- Al/Zn: hydroxid lưỡng tính tan trong kiềm dư; đủ NH₄Cl làm Al(OH)₃ tái kết tủa, còn Zn có thể ở dạng phức ammin tan. “Hai ống giống nhau” chỉ có giá trị trong nhánh đã chuẩn bị đúng, không tự xác nhận Zn cho mọi mẫu. [Prescott & Johnson — giáo trình phản ứng gốc](https://upload.wikimedia.org/wikipedia/commons/9/9f/Qualitative_chemical_analysis%3B_a_guide_in_qualitative_work_with_data_for_analytical_operations_and_laboratory_methods_%28IA_qualitativechemi00presrich%29.pdf), [Colorado Boulder — cân bằng NH₄⁺/NH₃/OH⁻](https://www.colorado.edu/lab/lecture-demo-manual/e770-prep-notes).
- Phép thử H₂SO₄/cồn và KI âm tính không được mô tả như phép khẳng định Ca độc lập. [Dữ liệu thực nghiệm CaSO₄ trong nước–ethanol](https://www.sciencedirect.com/science/article/pii/S0378381213005700).
- Br₂/I₂: giải thích phân biệt ion ban đầu với phân tử halogen tạo màu, và nêu ảnh hưởng của chất oxi hóa dư/hỗn hợp halid. [Buffalo State — phép thử anion](https://staff.buffalostate.edu/nazareay/che112/ex7.htm).
- Bi³⁺: BiI₃ đen tạo phức iodid tan trong KI dư; [WHO Drug Information — định tính bismuth](https://iris.who.int/bitstream/handle/10665/340680/9789240022805-eng.pdf).
- NH₄⁺: phản ứng giải phóng NH₃ và cân bằng tạo OH⁻ trên giấy ẩm được trình bày riêng; K⁺ được ghi rõ là kết luận loại trừ. [Rutgers — NH₃ và phenolphtalein](https://rutchem.rutgers.edu/cldf-demos/1556-solubility-of-a-gas-in-water-ammonia-fountain).

Nguồn trong từng khung hỗ trợ kiểm tra nguyên lý tương ứng; không mặc nhiên xác nhận mọi liều lượng, phân nhóm hoặc nhánh loại trừ của quy trình gốc. Riêng Monterqui vẫn thiếu công thức thuốc thử nên không đưa phương trình hay khẳng định chất tạo màu. Nội dung học liệu có thể hiệu chỉnh độc lập trong `explanations.js` để khớp giáo trình thực hành của trường.

Khi thử độ tan của tủa đã có (HNO₃, HCl, CH₃COOH, nước/đun), các hình “không tan” hoặc “tủa bền” luôn bắt đầu với tủa hiện sẵn và giữ nguyên. Chỉ cảnh tạo tủa mới có hiệu ứng lan đục; cảnh tủa tan và tái kết tủa vẫn thể hiện sự biến mất và xuất hiện đúng giai đoạn.
