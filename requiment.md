Dưới đây là **Tài liệu Yêu cầu Chi tiết (Detailed Requirements Specification)** hoàn chỉnh cho 3 trang của website bán quần áo, tích hợp các danh mục bạn yêu cầu (Áo hoodies zip, Áo hoodies, Áo thun, Áo sweater), hệ thống variant đổi ảnh theo màu sắc, cùng các tiêu chuẩn UI/UX hiện đại.

---

# TÀI LIỆU YÊU CẦU CHI TIẾT (REQUIREMENTS SPECIFICATION)

## I. YÊU CẦU CHUNG (GLOBAL REQUIREMENTS)

* **Màu chủ đạo (Primary Color):** `#2213F8` (Royal Blue) – Dùng cho các nút CTA chính, trạng thái active, badge nổi bật và logo.
* **Danh mục sản phẩm cố định (Categories):**
1. Áo hoodies zip
2. Áo hoodies
3. Áo thun
4. Áo sweater


* **Hệ thống Variant:** Mỗi sản phẩm có quản lý tồn kho theo tổ hợp **Màu sắc** và **Size** (M, L, XL).

---

## II. CHI TIẾT CÁC TRANG (PAGE SPECIFICATIONS)

### 1. Trang chủ (Homepage)

Trang chủ đóng vai trò thu hút khách hàng ngay từ cái nhìn đầu tiên và điều hướng họ đến các danh mục cốt lõi.

* **1.1. Navigation Bar (Thanh điều hướng):**
* **Logo:** Đặt bên trái (sử dụng file ảnh logo từ thư mục `assets`). Click vào quay về Trang chủ.
* **Menu Links:** Home, Cửa hàng (Shop - trỏ tới trang tìm kiếm/danh mục), Giới thiệu, Liên hệ.
* **Icons (Bên phải):**
* Icon Tìm kiếm (Click mở nhanh thanh search popup/input).
* Icon Giỏ hàng (Kèm badge hiển thị số lượng sản phẩm đang có trong giỏ).
* Icon Tài khoản người dùng.




* **1.2. Hero Slider (Banner quảng cáo):**
* Slider chạy tự động (hoặc có nút chuyển trái/phải thủ công).
* Hiển thị các banner quảng cáo bộ sưu tập mới (ví dụ: Bộ sưu tập Thu Đông, áo Hoodie mới).
* Mỗi slide có chèn tiêu đề, phụ đề và nút kêu gọi hành động **"Khám phá ngay"** (màu chủ đạo `#2213F8`) dẫn trực tiếp đến trang sản phẩm tương ứng.


* **1.3. Quick Category Grid (Danh mục nhanh):**
* Hiển thị 4 khối ảnh đại diện tương ứng với 4 danh mục: *Áo hoodies zip, Áo hoodies, Áo thun, Áo sweater*.
* Hành động: Click vào danh mục nào sẽ chuyển hướng sang Trang tìm kiếm/Danh mục với bộ lọc sẵn của danh mục đó.


* **1.4. Featured Products (Sản phẩm nổi bật):**
* Lưới sản phẩm (Grid) hiển thị 4-8 sản phẩm bán chạy hoặc sản phẩm mới.
* Mỗi thẻ sản phẩm (Product Card) gồm: Ảnh đại diện, Tên sản phẩm, Giá bán, các chấm màu (color swatches) minh họa variant màu có sẵn, và nút thêm nhanh vào giỏ hàng.


* **1.5. Footer (Chân trang):**
* Thông tin thương hiệu, địa chỉ, hotline, email hỗ trợ.
* Các liên kết chính sách (Chính sách đổi trả, bảo mật, vận chuyển).
* Form đăng ký nhận bản tin (Newsletter).



---

### 2. Trang tìm kiếm & Lọc sản phẩm (Search & Listing Page)

Trang này giúp khách hàng tìm kiếm chính xác món đồ họ muốn thông qua từ khóa và bộ lọc chuyên sâu.

* **2.1. Thanh tìm kiếm (Search Bar):**
* Ô input tìm kiếm chính đặt ở vị trí nổi bật phía trên, cho phép nhập từ khóa (ví dụ: "Hoodie zip đen").
* Tính năng gợi ý từ khóa tự động (Auto-suggest) khi gõ.


* **2.2. Hệ thống Bộ lọc (Filters Panel):**
* **Categories (Danh mục):** Checkbox hoặc danh sách chọn (Áo hoodies zip, Áo hoodies, Áo thun, Áo sweater). Cho phép chọn một hoặc nhiều.
* **Size (Kích thước):** Các nút bấm lựa chọn `[ M ]`, `[ L ]`, `[ XL ]`.
* **Màu sắc (Color):** Các ô màu (color swatches) để lọc theo tông màu.
* **Giá (Price Range):** Thanh trượt khoảng giá (Price slider) hoặc các khoảng giá định sẵn (Ví dụ: Dưới 300k, 300k - 500k, Trên 500k).
* Nút **"Áp dụng bộ lọc"** và **"Xóa bộ lọc"**.


* **2.3. Khu vực hiển thị kết quả (Product Grid):**
* Thanh sắp xếp (Sorting Dropdown): *Mới nhất, Bán chạy, Giá tăng dần, Giá giảm dần*.
* Dòng thông báo số lượng kết quả (Ví dụ: *"Tìm thấy 12 sản phẩm cho từ khóa..."*).
* Lưới hiển thị sản phẩm (mỗi sản phẩm hiển thị ảnh, tên, giá, và swatches màu).
* Trạng thái trống (Empty State): Hiển thị thông báo thân thiện và gợi ý từ khóa khác nếu không tìm thấy sản phẩm phù hợp.



---

### 3. Trang chi tiết sản phẩm (Product Detail Page - PDP)

Trang quyết định hành vi mua hàng của khách, yêu cầu hiển thị trực quan và thao tác mượt mà.

* **3.1. Khu vực Hình ảnh sản phẩm (Product Gallery):**
* Hiển thị ảnh lớn của sản phẩm và các ảnh thumbnail nhỏ bên dưới.
* **Logic tương tác Variant Màu sắc:**
* Khi người dùng click vào một **Variant màu sắc** ở phần thông tin (Ví dụ: Chuyển từ màu Đỏ sang màu Xanh trong thư mục `assets`), ảnh chính của sản phẩm sẽ tự động thay đổi sang file ảnh demo tương ứng của màu đó ngay lập tức mà không cần tải lại trang.




* **3.2. Thông tin cơ bản:**
* Tên sản phẩm.
* Giá sản phẩm (Hiển thị giá gốc và giá khuyến mãi nếu có).
* Trạng thái tồn kho (Ví dụ: "Còn hàng").


* **3.3. Khu vực chọn Variant sản phẩm:**
* **Chọn Màu sắc:** Hiển thị dạng các chấm tròn hoặc ô ảnh nhỏ tương ứng với các màu có sẵn (ví dụ 4 màu demo trong assets). Trạng thái màu đang chọn có viềnactive nổi bật.
* **Chọn Size:** Hiển thị dạng các nút bấm `[ M ]`, `[ L ]`, `[ XL ]`. Size nào hết hàng sẽ hiển thị trạng thái mờ/disabled.
* **Chọn Số lượng:** Bộ tăng giảm số lượng (`-` [ 1 ] `+`).


* **3.4. Nút Hành động (CTA Buttons):**
* Nút **"Thêm vào giỏ hàng"** (Add to Cart).
* Nút **"Mua ngay"** (Buy Now - chuyển thẳng tới trang thanh toán).


* **3.5. Hệ thống Tabs thông tin:**
* **Tab 1: Mô tả sản phẩm:** Chi tiết về chất liệu vải (ví dụ: nỉ bông, cotton 100%), kiểu dáng, hướng dẫn bảo quản giặt ủi.
* **Tab 2: Đánh giá sản phẩm:**
* Tổng quan số sao trung bình (Ví dụ: 4.8/5 sao) và tổng số lượng đánh giá.
* Danh sách các đánh giá đơn lẻ từ khách hàng (Tên khách hàng, số sao, nội dung bình luận, hình ảnh thực tế nếu có, thời gian đánh giá).




* **3.6. Khu vực sản phẩm liên quan / gợi ý (Related / Suggested Products):**
* Dải sản phẩm nằm phía dưới cùng (Carousel hoặc Grid 4 sản phẩm) với tiêu đề *"Có thể bạn cũng thích"* hoặc *"Sản phẩm tương tự"* (gợi ý các mẫu áo hoodie/sweater khác cùng danh mục).



---