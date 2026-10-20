/* Optional learning notes, mapped explicitly to each observation, not inferred from its label. */
'use strict';
window.IonLabKnowledge = (() => {
  const references = {
    anions: { title: 'Buffalo State University · Phép thử anion và màu halogen', url: 'https://staff.buffalostate.edu/nazareay/che112/ex7.htm' },
    separation: { title: 'Truman State University · Nguyên tắc tách và nhận biết ion', url: 'https://chemlab.truman.edu/chemical-principles/inorganic-quantitative-analysis/' },
    chlorides: { title: 'Indiana University East · Phân tích cation nhóm clorid', url: 'https://iu.pressbooks.pub/iuegenchemlabs/chapter/qualitative-analysis-of-cations/' },
    griess: { title: 'FDA · Thuốc thử phát hiện nitrit và sự phụ thuộc màu vào thành phần', url: 'https://www.fda.gov/food/laboratory-methods-food/bam-r48-nitrite-detection-reagents' },
    nitrate: { title: 'NTIS · Khử nitrat thành nitrit bằng kẽm trước phản ứng tạo màu', url: 'https://ntrl.ntis.gov/NTRL/dashboard/searchResults/titleDetail/AD648942.xhtml' },
    acetate: { title: 'University of Bristol · Ethyl acetate', url: 'https://www.chm.bris.ac.uk/motm/ethylacetate/ethylacetateh.htm' },
    oxalate: { title: 'Duke University · Độ bền của calci oxalat trong acid acetic', url: 'https://scholars.duke.edu/publication/717023' },
    carbonate: { title: 'Mustansiriyah University · Phân biệt carbonat và hydrocarbonat bằng Mg²⁺', url: 'https://uomustansiriyah.edu.iq/media/lectures/3/3_2024_09_24%2110_01_55_PM.pdf' },
    iron: { title: 'University of Colorado Boulder · Cân bằng phức sắt–thiocyanat', url: 'https://www.colorado.edu/lab/lecture-demo-manual/e710-complex-ion-shifting-equilibrium' },
    sulfateAlcohol: { title: 'Nghiên cứu thực nghiệm · Độ tan CaSO₄ trong hỗn hợp nước–ethanol', url: 'https://www.sciencedirect.com/science/article/pii/S0378381213005700' },
    amphoteric: { title: 'Prescott & Johnson · Phản ứng Al, Zn với kiềm và NH₄Cl (giáo trình gốc)', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Qualitative_chemical_analysis%3B_a_guide_in_qualitative_work_with_data_for_analytical_operations_and_laboratory_methods_%28IA_qualitativechemi00presrich%29.pdf' },
    ammoniumBuffer: { title: 'University of Colorado Boulder · NH₄Cl làm giảm OH⁻ trong cân bằng amoniac', url: 'https://www.colorado.edu/lab/lecture-demo-manual/e770-prep-notes' },
    bismuth: { title: 'WHO Drug Information · Phản ứng định tính bismuth với KI', url: 'https://iris.who.int/bitstream/handle/10665/340680/9789240022805-eng.pdf' },
    mercury: { title: 'University of Wisconsin–Madison · Tủa HgI₂ và phức iodid', url: 'https://demolab.chem.wisc.edu/general-chemistry-demonstrations-topic-page/aqueous-equilibrium-and-precipitation-reactions-orange-tornado-2/' },
    ammonia: { title: 'Rutgers University · NH₃, môi trường kiềm và phenolphtalein', url: 'https://rutchem.rutgers.edu/cldf-demos/1556-solubility-of-a-gas-in-water-ammonia-fountain' },
    ammoniaGeneration: { title: 'Chemical Demonstrations · Giải phóng NH₃ từ NH₄Cl và NaOH', url: 'https://files.eric.ed.gov/fulltext/ED286722.pdf' },
  };
  const note = (observation, reason, equations, meaning, sources = [], caution = '') => ({ observation, reason, equations, meaning, sources, note: caution });
  const byStep = {};
  byStep.start = [
    note('Không có tủa với AgNO₃', 'Chưa hình thành lượng muối bạc ít tan đủ để quan sát ở điều kiện thử. Điều này không có nghĩa dung dịch không chứa anion.', [], 'Chuyển sang các phép thử riêng nhánh A; chưa kết luận một ion cụ thể.', ['anions']),
    note('Có tủa với AgNO₃', 'Ag⁺ kết hợp với một số anion tạo muối ít tan. Nhiều anion cùng có thể cho tủa, nên chỉ nhìn tủa ban đầu chưa xác định được ion.', ['Ag⁺ + Cl⁻ → AgCl↓ (ví dụ)', '2Ag⁺ + CO₃²⁻ → Ag₂CO₃↓ (ví dụ)'], 'Thử độ tan của phần tủa trong HNO₃ để phân nhánh, rồi làm phép thử đặc hiệu.', ['anions', 'separation']),
  ];
  byStep.acid = [
    note('Tủa bạc tan khi thêm HNO₃', 'Acid có thể làm giảm nồng độ anion tự do bằng cách chuyển chúng thành dạng acid hoặc sản phẩm khí, khiến một số muối bạc tan. Cơ chế cụ thể phụ thuộc anion.', ['Ag₂CO₃↓ + 2H⁺ → 2Ag⁺ + CO₂↑ + H₂O (ví dụ)'], 'Chọn nhánh B theo sơ đồ. Độ tan chỉ giúp phân nhóm, chưa đủ để kết luận riêng carbonat hay oxalat.', ['separation']),
    note('Tủa bạc không tan trong điều kiện thử với HNO₃', 'Một số muối bạc, điển hình AgCl, bền trong môi trường acid của phép thử; không có quá trình tiêu thụ Cl⁻ như với carbonat.', ['Ag⁺ + Cl⁻ ⇌ AgCl↓'], 'Chọn nhánh C, sau đó dùng các phép thử riêng để phân biệt các anion có thể có.', ['anions', 'chlorides']),
  ];
  byStep.sulfate = [
    note('Có tủa sau khi thêm Ba(NO₃)₂', 'Ba²⁺ có thể tạo BaSO₄ trắng ít tan. Các anion khác cũng có thể tạo muối bari ít tan nên cần thử tiếp với acid.', ['Ba²⁺ + SO₄²⁻ → BaSO₄↓'], 'Chưa xác nhận SO₄²⁻ ở bước này; cần kiểm tra tủa có bền trong HCl loãng không.', ['anions']),
    note('Không có tủa với Ba(NO₃)₂', 'Không quan sát thấy lượng muối bari ít tan đủ để nhận biết. Nếu có đủ SO₄²⁻ và thuốc thử phù hợp, dự kiến sẽ xuất hiện BaSO₄.', ['Ba²⁺ + SO₄²⁻ → BaSO₄↓ (hiện tượng dự kiến khi dương tính)'], 'Ghi âm tính SO₄²⁻ trong điều kiện của bài thử. Mẫu quá loãng có thể làm tủa khó nhìn.', ['anions']),
  ];
  byStep['sulfate-acid'] = [
    note('Tủa bari không tan trong HCl loãng', 'BaSO₄ có độ tan rất nhỏ và bền trong HCl loãng. Đây là điểm giúp phân biệt với một số tủa bari tan được trong acid.', ['Ba²⁺ + SO₄²⁻ → BaSO₄↓'], 'Chuỗi tạo tủa rồi tủa bền trong acid hỗ trợ nhận biết SO₄²⁻.', ['anions']),
    note('Tủa bari tan trong HCl loãng', 'H⁺ làm một số anion tạo tủa chuyển thành dạng khác; ví dụ carbonat chuyển thành CO₂ và nước nên BaCO₃ tan.', ['BaCO₃↓ + 2H⁺ → Ba²⁺ + CO₂↑ + H₂O'], 'Hiện tượng này không phù hợp với tủa BaSO₄; app ghi phép thử SO₄²⁻ âm tính.', ['separation']),
  ];
  const griessReason = 'Nitrit tham gia phản ứng diazot hóa rồi ghép cặp tạo phẩm màu azo. Màu sinh ra từ sản phẩm phản ứng, không phải màu tự có của NO₂⁻.';
  const griessCaution = 'Màu cam giữ theo bài học gốc; sắc màu phụ thuộc thành phần Griess A/B. Sơ đồ dưới biểu diễn cơ chế tổng quát, không phải phương trình cân bằng của một công thức thuốc thử xác định.';
  byStep.nitrite = [
    note('Xuất hiện màu cam với thuốc thử Griess', griessReason, ['NO₂⁻ → chất trung gian diazoni → phẩm màu azo'], 'Phản ứng tạo màu hỗ trợ nhận biết NO₂⁻. Có nitrit sẽ gây nhiễu phép thử nitrat cùng nguyên lý tạo màu.', ['griess'], griessCaution),
    note('Không xuất hiện màu với thuốc thử Griess', 'Không quan sát được phẩm màu azo đặc trưng trong điều kiện thử. Cần phân biệt kết quả âm tính với trường hợp thuốc thử hoặc điều kiện phản ứng chưa phù hợp.', [], 'App ghi NO₂⁻ âm tính và mở phép thử NO₃⁻. Griess phát hiện nitrit trực tiếp; chưa khử nitrat thì không dùng kết quả này để loại NO₃⁻.', ['griess']),
  ];
  byStep.nitrate = [
    note('Xuất hiện màu cam sau bước khử bằng Zn', 'Nitrat được khử thành nitrit; nitrit sinh ra tiếp tục tạo phẩm màu azo với thuốc thử Griess. Vì vậy phải thử NO₂⁻ âm tính trước để tránh nhầm nitrit có sẵn là nitrat.', ['NO₃⁻ + Zn + 2H⁺ → NO₂⁻ + Zn²⁺ + H₂O', 'NO₂⁻ → chất trung gian diazoni → phẩm màu azo'], 'Khi nitrit ban đầu đã âm tính và bước khử được thực hiện đúng, màu sau khử hỗ trợ nhận biết NO₃⁻.', ['nitrate', 'griess'], 'Phương trình Zn biểu diễn giai đoạn khử đến nitrit; điều kiện khử ảnh hưởng sản phẩm. Màu cam giữ theo công thức thuốc thử của bài học gốc.'),
    note('Không có màu sau bước khử và phản ứng Griess', 'Không phát hiện nitrit qua phản ứng tạo màu sau bước xử lý mẫu. Khử không phù hợp hoặc thuốc thử hoạt động kém cũng có thể làm phản ứng không lên màu.', [], 'App ghi NO₃⁻ âm tính trong sơ đồ bài tập; khi thực hành cần kiểm tra điều kiện khử và thuốc thử trước khi loại nitrat.', ['nitrate', 'griess']),
  ];
  byStep.acetate = [
    note('Nhận thấy mùi este', 'Trong môi trường acid, acetat chuyển thành acid acetic; acid này phản ứng với ethanol tạo ethyl acetate có mùi đặc trưng. H₂SO₄ tạo môi trường acid và xúc tác phản ứng este hóa.', ['CH₃COO⁻ + H⁺ ⇌ CH₃COOH', 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O\n(H⁺, đun nóng)'], 'Mùi este hỗ trợ nhận biết CH₃COO⁻ trong bài học. Ethyl acetate không phải isoamyl acetate thường gọi là “dầu chuối”.', ['acetate']),
    note('Không nhận thấy mùi este', 'Chưa nhận thấy lượng ethyl acetate đủ để nhận biết. Phản ứng este hóa là cân bằng; nồng độ, nhiệt độ và thời gian ảnh hưởng lượng sản phẩm.', ['CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O'], 'Ghi âm tính theo điều kiện thử của bài học; không dùng riêng việc không ngửi thấy mùi để loại acetat trong mọi mẫu.', ['acetate']),
  ];
  byStep.carbonate = [
    note('Sủi bọt khi thêm HCl', 'Cả carbonat và hydrocarbonat đều nhận H⁺ rồi giải phóng CO₂. Vì hai ion cùng tạo khí nên bước này chưa phân biệt được chúng.', ['CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O', 'HCO₃⁻ + H⁺ → CO₂↑ + H₂O'], 'Tiếp tục thử Mg(NO₃)₂ trên phần dung dịch gốc mới. Không dùng lại phần mẫu đã bị acid hóa.', ['anions']),
    note('Không sủi bọt khi thêm HCl', 'Không thấy khí CO₂ thoát ra đủ để quan sát ở điều kiện thử.', ['CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O (dự kiến khi có carbonat)'], 'Ghi âm tính nhóm CO₃²⁻/HCO₃⁻ trong bài tập. Ở nồng độ thấp, sự thoát khí có thể khó nhận ra.', ['anions']),
  ];
  byStep['carbonate-mg'] = [
    note('Có tủa với Mg(NO₃)₂ trên mẫu mới', 'CO₃²⁻ có thể tạo muối carbonat magnesi ít tan trong điều kiện phép thử. Thành phần tủa thực tế còn phụ thuộc pH và nhiệt độ.', ['Mg²⁺ + CO₃²⁻ → MgCO₃↓ (mô hình giản lược)'], 'Sau phép thử thoát CO₂ dương tính, hiện tượng tạo tủa ở bước này được dùng để chọn CO₃²⁻ theo sơ đồ.', ['carbonate'], 'So sánh ở điều kiện bài thực hành; đun nóng mẫu hydrocarbonat có thể làm thay đổi kết quả.'),
    note('Không có tủa với Mg(NO₃)₂ trên mẫu mới', 'Hydrocarbonat có thể tồn tại trong dung dịch với Mg²⁺ mà chưa tạo tủa ở điều kiện thử nguội của phép phân biệt. Khi đun, cân bằng có thể thay đổi và tạo carbonat.', ['2HCO₃⁻ ⇌ CO₃²⁻ + CO₂ + H₂O'], 'Chỉ chọn HCO₃⁻ sau khi bước thử với acid đã có sủi bọt; riêng “không tủa” chưa chứng minh có hydrocarbonat.', ['carbonate']),
  ];
  byStep.oxalate = [
    note('Tủa bền sau khi thêm CH₃COOH', 'Ca²⁺ tạo CaC₂O₄ ít tan với oxalat. Tủa này bền trong acid acetic của phép thử, giúp phân biệt với một số muối calci tan được trong acid acetic.', ['Ca²⁺ + C₂O₄²⁻ → CaC₂O₄↓'], 'Chuỗi tạo tủa rồi tủa không tan trong CH₃COOH hỗ trợ nhận biết C₂O₄²⁻.', ['oxalate']),
    note('Không có tủa hoặc tủa tan', 'Có hai khả năng âm tính: không hình thành lượng muối calci ít tan đủ thấy, hoặc tủa ban đầu tan trong CH₃COOH nên không phù hợp tính chất CaC₂O₄ của phép thử.', ['Ca²⁺ + C₂O₄²⁻ → CaC₂O₄↓ (dự kiến khi dương tính)'], 'Không ghi nhận C₂O₄²⁻ theo phép thử này. “Không có tủa” và “có tủa rồi tan” là hai hiện tượng khác nhau, cùng dẫn đến nhánh âm tính.', ['oxalate']),
  ];
  byStep.thiocyanate = [
    note('Dung dịch chuyển đỏ máu', 'Fe³⁺ phối trí với SCN⁻ tạo phức tan màu đỏ. Đây là màu của phức trong dung dịch, không phải tủa đỏ.', ['Fe³⁺ + SCN⁻ ⇌ [FeSCN]²⁺'], 'Màu đỏ đặc trưng hỗ trợ nhận biết SCN⁻ với FeCl₃. Phương trình biểu diễn một dạng phức; thành phần phức phụ thuộc điều kiện.', ['iron']),
    note('Không xuất hiện màu đỏ máu', 'Không quan sát được màu đặc trưng của phức sắt(III)–thiocyanat. Màu vàng nhạt của thuốc thử FeCl₃ không phải phản ứng dương tính.', ['Fe³⁺ + SCN⁻ ⇌ [FeSCN]²⁺ (dự kiến khi dương tính)'], 'Ghi SCN⁻ âm tính trong phép thử; pH và chất tạo phức cạnh tranh có thể ảnh hưởng màu.', ['iron']),
  ];
  const halideNote = 'Màu thuộc Br₂/I₂ tạo thành, không phải màu của ion Br⁻/I⁻. Chất oxi hóa dư có thể làm biến đổi hoặc mất màu; hỗn hợp halid cần sơ đồ phân tích riêng.';
  byStep.halides = [
    note('Lớp cloroform bên dưới màu vàng cam', 'Chất oxi hóa của Javen trong môi trường acid chuyển Br⁻ thành Br₂. Br₂ phân bố vào lớp cloroform tạo màu vàng cam, đậm nhạt tùy nồng độ.', ['ClO⁻ + 2Br⁻ + 2H⁺ → Br₂ + Cl⁻ + H₂O'], 'Trong mô hình bài tập, lớp hữu cơ vàng cam được ghi là Br⁻.', ['anions'], halideNote),
    note('Lớp cloroform bên dưới màu tím', 'I⁻ bị oxi hóa thành I₂. I₂ phân bố vào lớp cloroform, cho màu tím đặc trưng trong dung môi này.', ['ClO⁻ + 2I⁻ + 2H⁺ → I₂ + Cl⁻ + H₂O'], 'Trong mô hình bài tập, lớp hữu cơ tím được ghi là I⁻.', ['anions'], halideNote),
    note('Lớp hữu cơ không có màu đặc trưng', 'Không quan sát được màu Br₂ hoặc I₂ đủ rõ trong lớp cloroform. Nồng độ thấp, phân lớp chưa tốt hoặc chất oxi hóa dư đều có thể ảnh hưởng kết quả.', [], 'Ghi âm tính phép thử Br⁻/I⁻ theo bài tập; không suy ra mẫu không có mọi loại halid.', ['anions']),
  ];
  byStep.chloride = [note('Có tủa sau khi thêm AgNO₃', 'Cl⁻ tạo AgCl ít tan với Ag⁺. Nhưng nhiều anion khác cũng kết tủa với Ag⁺, nên bước này mới là phản ứng sơ bộ.', ['Ag⁺ + Cl⁻ → AgCl↓'], 'Rửa tủa rồi kiểm tra chuỗi tan trong amoniac và tái kết tủa khi acid hóa.', ['chlorides'])];
  byStep['chloride-confirm'] = [
    note('Tủa tan trong amoniac, rồi xuất hiện lại với HNO₃', 'NH₃ tạo phức tan với Ag⁺ nên AgCl tan. Acid chuyển NH₃ thành NH₄⁺, làm giảm NH₃ tự do; phức bị phân hủy và AgCl kết tủa trở lại.', ['AgCl↓ + 2NH₃ ⇌ [Ag(NH₃)₂]⁺ + Cl⁻', '[Ag(NH₃)₂]⁺ + Cl⁻ + 2H⁺ → AgCl↓ + 2NH₄⁺'], 'Chuỗi tan → tái kết tủa hỗ trợ xác nhận Cl⁻. NH₄OH trong hướng dẫn là cách gọi dung dịch amoniac.', ['chlorides']),
    note('Không quan sát đủ chuỗi tan → tái kết tủa', 'Tủa có thể không phải AgCl, hoặc lượng NH₃/acid và việc rửa tủa chưa phù hợp. Chỉ có tủa ban đầu chưa đủ để xác nhận clorid.', ['AgCl↓ + 2NH₃ ⇌ [Ag(NH₃)₂]⁺ + Cl⁻ (chuỗi cần kiểm tra)'], 'App ghi phép thử Cl⁻ âm tính. Khi thực hành, cần xem lại đúng giai đoạn không khớp trước khi loại Cl⁻.', ['chlorides']),
  ];
  byStep.cg1 = [
    note('Có tủa với HCl ở nhóm I', 'Cl⁻ tạo muối ít tan với Ag⁺ và Pb²⁺ trong tập ion của bài học. Tạo tủa chỉ xác định nhóm, chưa phân biệt hai cation.', ['Ag⁺ + Cl⁻ → AgCl↓', 'Pb²⁺ + 2Cl⁻ → PbCl₂↓'], 'Thử độ tan của phần tủa trong nhiều nước khi đun để phân biệt tiếp.', ['chlorides']),
    note('Không có tủa với HCl ở nhóm I', 'Chưa quan sát được lượng clorid ít tan đủ thấy. Nếu có đủ Ag⁺ hoặc Pb²⁺ trong điều kiện kết tủa phù hợp, dự kiến sẽ có tủa.', [], 'Chuyển sang nhóm II theo sơ đồ. Kết quả âm tính phụ thuộc nồng độ và điều kiện thuốc thử.', ['chlorides']),
  ];
  byStep['cg1-heat'] = [
    note('Tủa tan khi thêm nhiều nước và đun', 'Độ tan của PbCl₂ tăng khi nhiệt độ tăng. Thêm nước và đun giúp phần PbCl₂ đi vào dung dịch.', ['PbCl₂↓ ⇌ Pb²⁺ + 2Cl⁻\n(cân bằng hòa tan thuận lợi hơn khi đun)'], 'Trong cặp Ag⁺/Pb²⁺ của sơ đồ, hiện tượng này được dùng để ghi Pb²⁺.', ['chlorides']),
    note('Tủa vẫn không tan khi đun trong nước', 'AgCl ít tan trong nước và không tan đáng kể khi đun theo phép thử; khác với PbCl₂ dễ tan hơn trong nước nóng.', ['AgCl↓ ⇌ Ag⁺ + Cl⁻\n(cân bằng thiên mạnh về phía chất rắn)'], 'Trong cặp Ag⁺/Pb²⁺ của sơ đồ, tủa còn lại được quy về Ag⁺. Mẫu hỗn hợp cần tách và xác nhận đầy đủ.', ['chlorides']),
  ];
  const barium = note('Tủa xuất hiện ngay với H₂SO₄', 'Ba²⁺ kết hợp SO₄²⁻ tạo BaSO₄ rất ít tan. Trong sơ đồ bài học, tủa xuất hiện nhanh là dấu hiệu hướng đến Ba²⁺.', ['Ba²⁺ + SO₄²⁻ → BaSO₄↓'], 'Ghi Ba²⁺ theo nhánh hiện tại. Tốc độ tạo tủa còn phụ thuộc nồng độ và thao tác; không dùng tốc độ riêng lẻ để nhận biết mọi mẫu.', ['anions']);
  byStep['cg2-0'] = [barium, note('Không tủa hoặc tủa xuất hiện chậm với một giọt H₂SO₄', 'Chưa có dấu hiệu kết tủa nhanh của BaSO₄ theo sơ đồ. CaSO₄ tan nhiều hơn BaSO₄ nên có thể khó tạo tủa ở bước này.', [], 'Tiếp tục thêm H₂SO₄ và cồn để tăng khả năng phát hiện tủa; chưa kết luận không có nhóm II.', ['sulfateAlcohol'])];
  const alcohol = [
    note('Có tủa sau khi thêm H₂SO₄ và cồn', 'Thêm sulfat và thay đổi môi trường dung môi bằng ethanol giúp một số muối sulfat ít tan hơn; vì thế tủa có thể xuất hiện rõ hơn.', ['Ca²⁺ + SO₄²⁻ ⇌ CaSO₄↓ (mô hình giản lược)'], 'Tủa ở bước này chưa xác nhận riêng Ca²⁺. App tiếp tục phép thử KI trên mẫu gốc để phân biệt nhánh theo bài học.', ['sulfateAlcohol']),
    note('Không tủa sau khi thêm H₂SO₄ và cồn', 'Không quan sát thấy muối sulfat kết tủa đủ để nhận biết sau khi tăng thuốc thử và thêm ethanol.', [], 'Sơ đồ chuyển sang nhóm III. Âm tính ở đây chỉ áp dụng điều kiện và tập ion của bài tập.', ['sulfateAlcohol']),
  ];
  const bismuth = note('Tủa đen xuất hiện rồi tan thành dung dịch cam trong KI dư', 'Bi³⁺ tạo BiI₃ màu đen với I⁻. Khi iodid dư, tủa tạo phức iodid tan có màu cam; đây là hai giai đoạn khác nhau.', ['Bi³⁺ + 3I⁻ → BiI₃↓', 'BiI₃↓ + I⁻ ⇌ [BiI₄]⁻'], 'Quan sát đủ chuỗi tủa đen → dung dịch cam để hỗ trợ nhận biết Bi³⁺; phần cam là dung dịch phức.', ['bismuth']);
  const calcium = note('Không có chuỗi tủa đen → dung dịch cam với KI', 'Ca²⁺ không cho chuỗi phản ứng BiI₃ rồi phức iodid màu cam như Bi³⁺. Vì vậy KI ở đây giúp loại nhánh bismuth.', [], 'Chỉ sau các bước phân nhóm trước đó, sơ đồ mới quy kết quả này về Ca²⁺. Riêng việc không đen với KI chưa phải phép thử khẳng định Ca²⁺.', ['bismuth']);
  for (const group of [0, 1]) {
    byStep[`cg2-${group}-alcohol`] = alcohol;
    byStep[`cg2-${group}-ki`] = [bismuth, calcium];
  }
  byStep['cg2-1'] = [barium, note('Không có tủa với H₂SO₄ sau khi tách nhóm I', 'Tách nhóm I giúp loại nhiễu của các cation đã tạo clorid ít tan. Chưa thấy tủa sulfat ở bước này nên tiếp tục thử trong môi trường có cồn.', [], 'Không đồng nhất “không tủa lúc này” với “không có Ca²⁺”; cần làm bước H₂SO₄/cồn kế tiếp.', ['chlorides', 'sulfateAlcohol'])];
  const hydroxides = [
    note('Tủa xuất hiện rồi tan trong NaOH dư', 'Al³⁺ và Zn²⁺ tạo hydroxid ít tan khi mới thêm OH⁻. Các hydroxid lưỡng tính này tan trong kiềm dư do tạo phức hydroxo tan.', ['Al³⁺ + 3OH⁻ → Al(OH)₃↓', 'Al(OH)₃↓ + OH⁻ ⇌ [Al(OH)₄]⁻', 'Zn²⁺ + 2OH⁻ → Zn(OH)₂↓', 'Zn(OH)₂↓ + 2OH⁻ ⇌ [Zn(OH)₄]²⁻'], 'Gợi ý nhóm Al³⁺/Zn²⁺; cần so sánh với NH₄Cl để phân biệt tiếp.', ['amphoteric']),
    note('Tủa còn bền khi NaOH đã dư', 'Một số cation trong sơ đồ tạo chất rắn không tan đáng kể trong kiềm dư. Ví dụ Mg²⁺ tạo Mg(OH)₂; không phải mọi tủa ở bước này đều là Mg(OH)₂.', ['Mg²⁺ + 2OH⁻ → Mg(OH)₂↓ (ví dụ)'], 'Giữ tủa để xét nhóm IV/V. Phần dung dịch vẫn có thể chứa phức hydroxo của Al/Zn, nên cần tách và xét đúng phần mẫu.', ['separation']),
    note('Không có tủa trong quá trình thêm NaOH', 'Chưa quan sát được giai đoạn tạo chất rắn. Cần phân biệt “không tủa từ đầu” với “đã có tủa nhưng tan hết khi thuốc thử dư”.', [], 'Sơ đồ chuyển sang nhóm VI. Khi thực hành phải quan sát từ lúc nhỏ giọt đầu, không chỉ nhìn trạng thái cuối.', ['separation']),
  ];
  for (const id of ['cg3-0', 'cg3-1', 'cg3-Ba', 'cg3-Ca']) byStep[id] = hydroxides;
  const aluminum = note('Ống thêm NH₄Cl đục hơn ống đối chứng', 'NH₄⁺ tiêu thụ OH⁻, giảm độ kiềm và làm aluminate chuyển về Al(OH)₃ ít tan. Hạt Al(OH)₃ làm ống có NH₄Cl đục hơn.', ['NH₄⁺ + OH⁻ → NH₃ + H₂O', '[Al(OH)₄]⁻ + NH₄⁺ → Al(OH)₃↓ + NH₃ + H₂O'], 'Trong phần dung dịch nhóm III đã chuẩn bị đúng, độ đục tăng sau NH₄Cl hỗ trợ nhận biết Al³⁺.', ['amphoteric', 'ammoniumBuffer']);
  const zinc = note('Hai ống có độ đục gần như nhau', 'Trong điều kiện dùng đủ NH₄Cl của phép phân biệt, Zn có thể được giữ trong dung dịch nhờ tạo phức với NH₃. Vì vậy không có độ đục tăng rõ như Al(OH)₃.', ['[Zn(OH)₄]²⁻ + 4NH₄⁺ ⇌ [Zn(NH₃)₄]²⁺ + 4H₂O'], 'Kết quả hướng đến Zn²⁺ theo phép loại trừ Al/Zn trong sơ đồ. Chỉ “hai ống như nhau” chưa tự chứng minh có Zn²⁺; một nhánh sẽ kiểm tra tiếp Monterqui.', ['amphoteric'], 'Phải dùng đúng lượng NH₄Cl và điều kiện bài thực hành; lượng chưa đủ có thể gây tủa trung gian.');
  for (const id of ['cg3-0-compare', 'cg3-1-compare', 'cg3-Ba-compare', 'cg3-Ca-compare']) byStep[id] = [aluminum, zinc];
  byStep['zn-monterqui'] = [
    note('Xuất hiện màu tím xim trong phép thử Monterqui', 'Bài học gốc dùng sự xuất hiện màu tím xim để nhận biết Zn²⁺ sau bước phân nhóm. Tuy nhiên bản gốc chưa cung cấp thành phần thuốc thử Monterqui.', [], 'App ghi Zn²⁺ theo sơ đồ đang dùng. Muốn giải thích cơ chế và viết phương trình chính xác phải đối chiếu công thức thuốc thử trong giáo trình thực hành.', [], 'Chưa gán chất tạo màu hoặc tự bổ sung phương trình khi thiếu công thức thuốc thử.'),
    note('Không xuất hiện màu tím xim trong phép thử Monterqui', 'Chưa quan sát thấy dấu hiệu màu mà bài học quy định cho phản ứng dương tính. Bản gốc chưa có công thức thuốc thử nên chưa xác định được cơ chế cụ thể.', [], 'Không ghi nhận thêm Zn²⁺ ở bước này; tiếp tục xét phần tủa theo sơ đồ. Khi thực hành cần đối chiếu thuốc thử và điều kiện trong giáo trình.', []),
  ];
  const mercury = note('Tủa đỏ cam xuất hiện rồi tan trong KI dư', 'Hg²⁺ tạo HgI₂ đỏ cam với iodid. Khi I⁻ dư, HgI₂ chuyển thành phức tetraiodomercurat(II) tan nên tủa biến mất.', ['Hg²⁺ + 2I⁻ → HgI₂↓', 'HgI₂↓ + 2I⁻ ⇌ [HgI₄]²⁻'], 'Chuỗi tạo tủa đỏ cam → tan trong KI dư hỗ trợ nhận biết Hg²⁺, phân biệt với chuỗi tủa đen → dung dịch cam của Bi³⁺.', ['mercury']);
  const magnesium = note('Không có hai chuỗi hiện tượng đặc trưng với KI', 'Mg²⁺ không cho chuỗi kết tủa iodid có màu như Bi³⁺ hoặc Hg²⁺ trong phép thử này.', [], 'Kết luận Mg²⁺ là phép loại trừ trong tập ion và các bước phân nhóm của bài học. Không màu với KI không phải phép thử khẳng định Mg²⁺ độc lập.', ['separation']);
  for (const group of [0, 1, 2]) byStep[`cg4-${group}`] = [bismuth, mercury, magnesium];
  byStep.cg6 = [
    note('Giấy tẩm phenolphtalein chuyển hồng', 'Trong môi trường kiềm và khi đun, NH₄⁺ giải phóng NH₃. NH₃ hòa tan trong lớp ẩm của giấy, làm tăng OH⁻; phenolphtalein chuyển hồng trong môi trường kiềm.', ['NH₄⁺ + OH⁻ → NH₃↑ + H₂O\n(đun nóng)', 'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻'], 'Màu hồng trên giấy hỗ trợ nhận biết NH₄⁺. Giấy phải có độ ẩm phù hợp và không bị dung dịch kiềm bắn trực tiếp lên.', ['ammonia', 'ammoniaGeneration']),
    note('Giấy tẩm phenolphtalein không đổi màu', 'Không phát hiện được lượng NH₃ đủ làm giấy chuyển hồng trong điều kiện thử. K⁺ không giải phóng NH₃ khi xử lý như NH₄⁺.', [], 'Sơ đồ quy kết quả về K⁺ sau khi đã loại các nhóm trước. Giấy không hồng chỉ là kết quả âm tính với NH₄⁺, không phải phép thử khẳng định K⁺ độc lập.', ['ammonia', 'separation']),
  ];
  return { byStep, references };
})();
