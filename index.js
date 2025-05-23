import express from "express";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import markdownIt from "markdown-it";
import hljs from "highlight.js";  // إضافة highlight.js

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعداد Markdown
const md = new markdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang }).value + '</code></pre>';
      } catch (err) {
        console.error("Highlighting error:", err);
      }
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// عرض الصفحة الرئيسية بناءً على اللغة المختارة
app.get("/", (req, res) => {
  const lang = req.query.lang || "en";
  res.render("index", { lang });
});

// معالجة الطلبات الخاصة بالتوليد
app.post("/generate", async (req, res) => {
  const { prompt, lang = "en" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: lang === "ar" ? "الحقل مطلوب." : "Prompt is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const stream = await model.generateContentStream(prompt);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    for await (const chunk of stream.stream) {
      const part = chunk.text();

      // استخدام Markdown لتنسيق النص
      const formattedPart = md.render(part);

      // إرسال الجزء المنسق عبر SSE
      res.write(`data: ${formattedPart}\n\n`);
    }

    // عند الانتهاء، إرسال [DONE]
    res.write("data: [DONE]\n\n");

    // إغلاق الاتصال بعد إتمام البث
    res.end();

  } catch (err) {
    console.error("Generation error:", err);

    let errorMessage = lang === "ar" ? "حدث خطأ أثناء التوليد. يرجى المحاولة مرة أخرى." : "Failed to generate content. Please try again.";

    if (err.response && err.response.status === 429) {
      errorMessage = lang === "ar" ? "تم الوصول إلى الحد الأقصى للطلبات، يرجى المحاولة لاحقًا." : "Rate limit exceeded. Please try again later.";
    } else if (err.response && err.response.status === 401) {
      errorMessage = lang === "ar" ? "مفتاح API غير صالح." : "Invalid API key.";
    }

    // إرسال رسالة الخطأ عبر الـ Event Stream
    res.write(`data: error:${errorMessage}\n\n`);
    res.end();
  }
});

// تشغيل السيرفر على البورت المطلوب
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
