# 📝 Blogara

**Blogara** is a modern, full-featured blogging platform built with Next.js 15, Tailwind CSS, ShadCN UI, and MongoDB. It features a powerful admin panel, an intuitive author dashboard, and a fully accessible public blog site. Blogara is perfect for personal blogs, educational platforms, and knowledge-sharing hubs.

---

## 🚀 Features

### 🔐 Admin Panel
- Manage all blog posts (create/edit/delete)
- Category and tag management
- Author management (add/edit/remove authors)
- Subscriber management (view/export/delete)
- Auto email notifications for new posts
- Admin profile and account settings

### 📝 Author Dashboard
- View personal dashboard with recent activity
- Create, update, delete own posts using Markdown
- Profile and account management

### 🌐 Public Blog
- Read blog posts without login
- Filter posts by tag/category
- Subscribe/unsubscribe via email
- Share posts and view related content

---

## 🛠 Tech Stack

| Area          | Technology               |
|---------------|---------------------------|
| Framework     | Next.js 15 (App Router)   |
| Styling       | Tailwind CSS, ShadCN UI   |
| Auth          | NextAuth.js or JWT        |
| ORM / DB      | Prisma + MongoDB          |
| Image Upload  | UploadThing               |
| Markdown      | React Markdown Editor     |
| SEO           | next-sitemap              |
| Email         | Nodemailer                |

---

## 🧱 Database ERD
https://shandraw.vercel.app/share/Wg8hn75QCx


## 📄 Pages Overview

### 🌐 Public Pages
- `/` – Home (Hero + latest + popular + subscribe)
- `/posts` – Blog list (filter by tag/category, search, pagination)
- `/posts/[slug]` – Blog detail page

### 🔒 Admin/Author Dashboard
- `/dashboard` – Overview + stats + quick actions
- `/dashboard/posts` – Manage posts
- `/dashboard/posts/new` – Create post
- `/dashboard/posts/[id]/edit` – Edit post
- `/dashboard/categories` – Manage categories
- `/dashboard/tags` – Manage tags
- `/dashboard/authors` – Manage authors (admin only)
- `/dashboard/subscribers` – Manage subscribers (admin only)
- `/dashboard/profile` – Account/profile settings

---

## 🧑‍💻 Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/DevMFarhad/blogara
cd blogara
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables and Config Files
- Setup .env file according to .env.example
- Update config file "/src/config"

### 4. Run Development Server
```bash
npm run dev
```


## 📦 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

Made with ❤️ by [Mohammad Farhad](https://mfarhad.vercel.app)
