# 🌟 Gemini App

**Gemini App** is a dynamic AI-powered web application built with **Node.js**, integrating the **Google Gemini API** to deliver intelligent, real-time responses. It uses **Server-Sent Events (SSE)** for streaming, supports **English and Arabic**, and formats output with **Markdown** and **highlight.js**.

---

## 🚀 Features

- ⚡ Real-time response streaming (SSE)
- 🌍 Bilingual interface: English 🇬🇧 & Arabic 🇪🇬
- 🧠 Powered by Gemini 1.5 Flash from Google
- 📝 Markdown rendering with syntax highlighting
- 🖼️ UI built using EJS templates
- 🔐 Environment-based API key security

---

## 📸 Preview

![Screenshot 2025-05-23 211811](https://github.com/user-attachments/assets/a0b47f81-37f1-4974-9e35-51356c0a0bce)


---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **AI Model:** Google Generative AI (Gemini)
- **Templating:** EJS
- **Markdown Rendering:** markdown-it, highlight.js
- **Other Tools:** dotenv, body-parser

---

## 📦 Installation

```bash
git clone https://github.com/.medo-hussein/gemini-app.git
cd gemini-app
npm install
🔐 Setup Environment
Create a .env file in the root directory and add your API key:
API_KEY=your_google_api_key_here
▶️ Run the App
npm start
Visit: http://localhost:3000

📌 Notes
You must enable the Gemini API in your Google Cloud project.

Be mindful of your API usage limits and quota.

Streaming might not work on some hosting platforms without proper configuration.

🤝 Contributing
Feel free to fork the repo, suggest features, or submit pull requests!

📄 License
This project is licensed under the MIT License.

Built by Ahmed Hussein 💻 | Powered by Google Gemini 🌐
