# Text2Ae - Illustrator to After Effects Text Transfer

<div align="center">

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Adobe Illustrator](https://img.shields.io/badge/Adobe-Illustrator-FF9A00?logo=adobe-illustrator)
![Adobe After Effects](https://img.shields.io/badge/Adobe-After%20Effects-9999FF?logo=adobe-after-effects)

**Universal script to transfer text layers from Adobe Illustrator to After Effects with pixel-perfect accuracy**

[English](#english) • [العربية](#arabic)

</div>

---

<a name="english"></a>

## 🇬🇧 English

### 📖 Overview

**Text2Ae** is a single universal script that works in both Adobe Illustrator and After Effects. It exports text data from Illustrator and imports it into After Effects while preserving:

- ✅ **Exact Position** - Pixel-perfect placement with rotation support
- ✅ **Colors** - Fill and stroke colors (RGB & Grayscale)
- ✅ **Stroke** - Width and color
- ✅ **Rotation** - Rotated around center point
- ✅ **Opacity** - 0-100% transparency
- ✅ **Line Spacing** - Leading preserved
- ✅ **Scale** - Horizontal and vertical scaling
- ✅ **Font** - Font name (if installed on system)
- ✅ **Multi-line Text** - Full support with proper line breaks

### 🚀 Features

- **Single Universal Script** - One file works in both applications
- **Smart Detection** - Automatically detects which Adobe app is running
- **Configuration System** - Persistent settings saved to `AppData`
- **Settings Dialog** - Toggle alerts on/off for each application
- **Arabic Support** - Full support for Arabic and special characters
- **Clean UI** - Minimal, professional interface

---

### 📥 Installation

#### **Method 1: Manual Installation (Recommended)**

##### For After Effects

1. Download `Text2Ae.jsx`
2. Copy it to:

   ```
   C:\Program Files\Adobe\Adobe After Effects [VERSION]\Support Files\Scripts\ScriptUI Panels\
   ```

3. Restart After Effects
4. Go to **Window** → **Text2Ae**

##### For Illustrator

1. Download `Text2Ae.jsx`
2. Copy it to:

   ```
   C:\Program Files\Adobe\Adobe Illustrator [VERSION]\Presets\en_US\Scripts\
   ```

   *Note: Replace `en_US` with your language folder (e.g., `en_GB`, `ar_AE`)*
3. Restart Illustrator
4. Go to **File** → **Scripts** → **Text2Ae**

#### **Method 2: Run Directly**

You can also run the script directly without installation:

- **Illustrator:** File → Scripts → Other Script → Select `Text2Ae.jsx`
- **After Effects:** File → Scripts → Run Script File → Select `Text2Ae.jsx`

---

### 🎯 Usage

#### **Step 1: Export from Illustrator**

1. Open your Illustrator file
2. **Save the file** (Important!)
3. Run the script: **File** → **Scripts** → **Text2Ae**
4. A `.json` file will be created next to your `.ai` file
5. (Optional) A success message will appear

#### **Step 2: Import in After Effects**

1. Open your After Effects project
2. Import the Illustrator file as **Footage**
3. Create a new **Composition** (or open existing)
4. Drag the Illustrator file into the composition as a **Layer**
5. **Select the layer**
6. Open the Text2Ae panel: **Window** → **Text2Ae**
7. Click **"Import from AI"**
8. All text layers will be created!

---

### ⚙️ Settings

Click the **⚙** (gear icon) button to open settings:

- **Show alerts in Illustrator** - Toggle export confirmation messages
- **Show alerts in After Effects** - Toggle import confirmation messages

Settings are automatically saved to:

```
C:\Users\[username]\AppData\Roaming\Text2Ae_Config.json
```

---

### 📋 Supported Properties

| Property | Status | Notes |
|----------|--------|-------|
| Position | ✅ Supported | Pixel-perfect with rotation |
| Fill Color | ✅ Supported | RGB & Grayscale |
| Stroke | ✅ Supported | Color and width |
| Rotation | ✅ Supported | Around center point |
| Opacity | ✅ Supported | 0-100% |
| Line Spacing (Leading) | ✅ Supported | Preserved from AI |
| Scale (X/Y) | ✅ Supported | Horizontal and vertical |
| Font | ✅ Supported | Must be installed on system |
| Text Alignment | ❌ Not Supported | Technical limitations* |
| Drop Shadow | ❌ Not Supported | Technical limitations* |

*These features cause Illustrator crashes when accessed via ExtendScript

---

### 🛠️ Troubleshooting

#### ❌ "Please save the Illustrator document first"

**Solution:** Save your AI file before running the export script.

#### ❌ "JSON data file not found"

**Solution:**

1. Run the script in Illustrator first
2. Ensure the AI filename matches the layer name in AE
3. Check that the `.json` file exists next to your `.ai` file

#### ❌ "Please select or open a Composition first"

**Solution:** Create or open a composition in After Effects.

#### ❌ Font not displaying correctly

**Solution:** Ensure the font used in Illustrator is installed on your system.

#### ❌ Positions are incorrect

**Solution:**

1. Ensure Comp size in AE = Artboard size in AI
2. Make sure text is within the active artboard in Illustrator

---

### 💡 Tips

1. **Always save** your Illustrator file before exporting
2. **Select the layer** in After Effects before importing
3. **Use matching names** for AI file and AE layer
4. **Match sizes**: Composition size in AE should equal Artboard size in AI
5. Multi-line text is fully supported with line breaks

---

### License

MIT License - Feel free to use and modify!

---

<a name="arabic"></a>

## 🇸🇦 العربية

### 📖 نظرة عامة

**Text2Ae** هو سكريبت موحد يعمل على Adobe Illustrator و Adobe After Effects. يقوم بتصدير بيانات النصوص من Illustrator واستيرادها في After Effects مع الحفاظ على:

- ✅ **الموقع الدقيق** - وضع دقيق بالبكسل مع دعم الدوران
- ✅ **الألوان** - ألوان التعبئة والحدود (RGB ودرجات الرمادي)
- ✅ **الحدود** - السُمك واللون
- ✅ **التدوير** - حول نقطة المركز
- ✅ **الشفافية** - من 0-100%
- ✅ **المسافة بين الأسطر** - محفوظة من AI
- ✅ **التمدد** - الأفقي والعمودي
- ✅ **الخط** - اسم الخط (إذا كان مثبتاً على النظام)
- ✅ **النصوص متعددة الأسطر** - دعم كامل مع فواصل الأسطر

### 🚀 المميزات

- **سكريبت موحد واحد** - ملف واحد يعمل على البرنامجين
- **كشف ذكي** - يكتشف تلقائياً أي برنامج Adobe يعمل
- **نظام إعدادات** - حفظ دائم للإعدادات في `AppData`
- **نافذة إعدادات** - تفعيل/إلغاء التنبيهات لكل برنامج
- **دعم العربية** - دعم كامل للأحرف العربية والخاصة
- **واجهة نظيفة** - واجهة بسيطة واحترافية

---

### 📥 التثبيت

#### **الطريقة 1: التثبيت اليدوي (موصى به)**

##### لبرنامج After Effects

1. قم بتحميل ملف `Text2Ae.jsx`
2. انسخه إلى المجلد:

   ```
   C:\Program Files\Adobe\Adobe After Effects [VERSION]\Support Files\Scripts\ScriptUI Panels\
   ```

3. أعد تشغيل After Effects
4. اذهب إلى **Window** → **Text2Ae**

##### لبرنامج Illustrator

1. قم بتحميل ملف `Text2Ae.jsx`
2. انسخه إلى المجلد:

   ```
   C:\Program Files\Adobe\Adobe Illustrator [VERSION]\Presets\en_US\Scripts\
   ```

   *ملاحظة: استبدل `en_US` بمجلد لغتك (مثل: `en_GB`، `ar_AE`)*
3. أعد تشغيل Illustrator
4. اذهب إلى **File** → **Scripts** → **Text2Ae**

#### **الطريقة 2: التشغيل المباشر**

يمكنك أيضاً تشغيل السكريبت مباشرة بدون تثبيت:

- **Illustrator:** File → Scripts → Other Script → اختر `Text2Ae.jsx`
- **After Effects:** File → Scripts → Run Script File → اختر `Text2Ae.jsx`

---

### 🎯 طريقة الاستخدام

#### **الخطوة 1: التصدير من Illustrator**

1. افتح ملف Illustrator الخاص بك
2. **احفظ الملف** (مهم جداً!)
3. شغل السكريبت: **File** → **Scripts** → **Text2Ae**
4. سيتم إنشاء ملف `.json` بجانب ملف `.ai`
5. (اختياري) ستظهر رسالة نجاح العملية

#### **الخطوة 2: الاستيراد في After Effects**

1. افتح مشروع After Effects
2. استورد ملف Illustrator كـ **Footage**
3. أنشئ **Composition** جديدة (أو افتح موجودة)
4. اسحب ملف Illustrator إلى الـ Composition كـ **Layer**
5. **حدد الطبقة**
6. افتح لوحة Text2Ae: **Window** → **Text2Ae**
7. اضغط على **"Import from AI"**
8. سيتم إنشاء جميع طبقات النصوص!

---

### ⚙️ الإعدادات

اضغط على زر **⚙** (رمز الترس) لفتح الإعدادات:

- **Show alerts in Illustrator** - تفعيل/إلغاء رسائل التأكيد في Illustrator
- **Show alerts in After Effects** - تفعيل/إلغاء رسائل التأكيد في After Effects

يتم حفظ الإعدادات تلقائياً في:

```
C:\Users\[username]\AppData\Roaming\Text2Ae_Config.json
```

---

### 📋 الخصائص المدعومة

| الخاصية | الحالة | ملاحظات |
|---------|--------|---------|
| الموقع | ✅ مدعوم | دقة عالية مع الدوران |
| لون التعبئة | ✅ مدعوم | RGB ودرجات الرمادي |
| الحدود | ✅ مدعوم | اللون والسُمك |
| التدوير | ✅ مدعوم | حول نقطة المركز |
| الشفافية | ✅ مدعوم | من 0-100% |
| المسافة بين الأسطر | ✅ مدعوم | محفوظة من AI |
| التمدد (X/Y) | ✅ مدعوم | أفقي وعمودي |
| الخط | ✅ مدعوم | يجب أن يكون مثبتاً على النظام |
| محاذاة النص | ❌ غير مدعوم | قيود تقنية* |
| الظل | ❌ غير مدعوم | قيود تقنية* |

*هذه المميزات تسبب توقف Illustrator عند الوصول إليها عبر ExtendScript

---

### 🛠️ استكشاف الأخطاء

#### ❌ "Please save the Illustrator document first"

**الحل:** احفظ ملف AI قبل تشغيل سكريبت التصدير.

#### ❌ "JSON data file not found"

**الحل:**

1. شغل السكريبت في Illustrator أولاً
2. تأكد من تطابق اسم ملف AI مع اسم الطبقة في AE
3. تحقق من وجود ملف `.json` بجانب ملف `.ai`

#### ❌ "Please select or open a Composition first"

**الحل:** أنشئ أو افتح Composition في After Effects.

#### ❌ الخط لا يظهر بشكل صحيح

**الحل:** تأكد أن الخط المستخدم في Illustrator مثبت على نظامك.

#### ❌ المواقع غير صحيحة

**الحل:**

1. تأكد أن حجم Comp في AE = حجم Artboard في AI
2. تأكد أن النصوص داخل حدود الـ Artboard النشط في Illustrator

---

### 💡 نصائح

1. **احفظ دائماً** ملف Illustrator قبل التصدير
2. **حدد الطبقة** في After Effects قبل الاستيراد
3. **استخدم أسماء متطابقة** لملف AI وطبقة AE
4. **طابق الأحجام**: حجم Composition في AE يجب أن يساوي حجم Artboard في AI
5. النصوص متعددة الأسطر مدعومة بالكامل مع فواصل الأسطر

---

### 📜 الترخيص

رخصة MIT - استخدم وعدّل كما تشاء!

---

<div align="center">

## 🤖 Development Credit

**This entire project was built using [Antigravity AI](https://antigravity.dev)**

From concept to completion, including:

- Script development and optimization
- Configuration system implementation
- User interface design
- Bilingual documentation
- Git management

*Powered by Antigravity - The future of AI-assisted development*

---

**Made with ❤️ for the creative community**

</div>
