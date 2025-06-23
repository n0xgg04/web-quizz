#  Web Quiz - Ứng dụng trắc nghiệm kiến thức lập trình

Một ứng dụng web được xây dựng bằng Next.js và Tailwind CSS, cho phép người dùng làm các bài trắc nghiệm về nhiều chủ đề lập trình web khác nhau. Giao diện được thiết kế hiện đại và thân thiện với người dùng bằng cách sử dụng **shadcn/ui**.

![Giao diện ứng dụng Web Quiz](https://i.imgur.com/your-screenshot.png)
*(Lưu ý: Thay thế liên kết ảnh trên bằng ảnh chụp màn hình thực tế của ứng dụng)*

## ✨ Tính năng chính

-   **Nhiều chủ đề:** Hỗ trợ 10 chủ đề trắc nghiệm khác nhau (HTML, CSS, JavaScript, PHP, MySQL, v.v.).
-   **Hai chế độ:**
    -   **Luyện tập:** Xem đáp án ngay sau mỗi câu trả lời.
    -   **Thi thử:** Làm một bộ đề hoàn chỉnh và nhận điểm sau khi nộp bài.
-   **Cài đặt linh hoạt:**
    -   Chọn một hoặc nhiều chủ đề để kết hợp.
    -   Tùy chọn trộn câu hỏi.
    -   Chọn số lượng câu hỏi cho bài thi.
-   **Giao diện trực quan:**
    -   Hiển thị tất cả câu hỏi trong chế độ thi trên một trang duy nhất.
    -   Đánh dấu các câu đã trả lời, câu đúng, câu sai bằng màu sắc.
-   **Theo dõi và phân tích:** Tích hợp Firebase Analytics để theo dõi các sự kiện quan trọng như:
    -   Chủ đề được chọn nhiều nhất.
    -   Số lượt bắt đầu và hoàn thành bài luyện tập/bài thi.
    -   Điểm số của người dùng sau mỗi bài thi.

## 🚀 Công nghệ sử dụng

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
-   **Giao diện:** [React](https://react.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library:** [shadcn/ui](https://ui.shadcn.com/)
-   **Analytics:** [Firebase](https://firebase.google.com/)

## 🔧 Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone https://github.com/your-username/web-quizz.git
cd web-quizz
```

### 2. Cài đặt dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Cấu hình biến môi trường

Tạo một file `.env.local` ở thư mục gốc của dự án và thêm vào các thông tin cấu hình Firebase của bạn. Bạn có thể tham khảo file `.env.local.example`.

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef1234567890"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-ABCDEFGHIJ"
```

### 4. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem ứng dụng.

## 🤝 Đóng góp

Mọi ý kiến đóng góp đều được chào đón! Nếu bạn có ý tưởng để cải thiện ứng dụng, vui lòng fork repository và tạo một Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.
