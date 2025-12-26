# Text2Ae - نقل النصوص من Illustrator إلى After Effects

## 📖 نظرة عامة

سكريبت موحد يعمل على **Adobe Illustrator** و **Adobe After Effects** لنقل النصوص بدقة من Illustrator إلى After Effects مع الحفاظ على:

- الموقع الدقيق ✅
- الألوان والحدود ✅
- التدوير (Rotation) ✅
- الشفافية (Opacity) ✅
- المسافة بين الأسطر (Leading) ✅
- التمدد (Scale) ✅

---

## 🚀 طريقة الاستخدام

### الخطوة 1️⃣: التصدير من Illustrator

1. افتح ملف Illustrator الخاص بك
2. **احفظ الملف** (مهم جداً!)
3. شغل السكريبت `Text2Ae.jsx`
   - **طريقة 1:** File → Scripts → Other Script → اختر `Text2Ae.jsx`
   - **طريقة 2:** اسحب الملف على أيقونة Illustrator
4. سيظهر رسالة تأكيد بعدد النصوص المُصدرة وموقع ملف `.json`

### الخطوة 2️⃣: الاستيراد في After Effects

1. افتح مشروع After Effects
2. أضف ملف Illustrator كـ **Footage** في المشروع
3. أنشئ **Composition** جديدة (أو افتح موجودة)
4. اسحب ملف Illustrator للـ Composition كـ **Layer**
5. **حدد الـ Layer** هذا
6. شغل نفس السكريبت `Text2Ae.jsx`
   - File → Scripts → Run Script File → اختر `Text2Ae.jsx`
7. اضغط على زر **"Import from AI"**
8. ستظهر جميع النصوص في After Effects!

---

## ⚙️ المتطلبات

- Adobe Illustrator (أي إصدار يدعم ExtendScript)
- Adobe After Effects (أي إصدار يدعم ExtendScript)
- يجب أن يكون ملف Illustrator **محفوظاً** قبل التصدير
- حجم الـ Composition في After Effects يجب أن يطابق حجم الـ Artboard في Illustrator

---

## 📋 الميزات المدعومة

| الخاصية | حالة الدعم | ملاحظات |
|---------|------------|---------|
| الموقع (Position) | ✅ مدعوم | دقة عالية مع الروتيشن |
| الألوان (Fill) | ✅ مدعوم | RGB & Grayscale |
| الحدود (Stroke) | ✅ مدعوم | اللون والسُمك |
| التدوير (Rotation) | ✅ مدعوم | حول المركز |
| الشفافية (Opacity) | ✅ مدعوم | 0-100% |
| المسافة بين الأسطر (Leading) | ✅ مدعوم | Line spacing |
| التمدد (Scale X/Y) | ✅ مدعوم | النسبة الأفقية والعمودية |
| الخط (Font) | ✅ مدعوم | بشرط وجوده في النظام |
| المحاذاة (Justification) | ❌ غير مدعوم | لأسباب تقنية* |
| الظلال (Drop Shadow) | ❌ غير مدعوم | لأسباب تقنية* |

**لأسباب تقنية:* الوصول إلى بعض الخصائص في Illustrator يسبب كراش البرنامج

---

## 🛠️ استكشاف الأخطاء

### ❌ "Please save the Illustrator document first"

**الحل:** احفظ الملف في Illustrator قبل تشغيل السكريبت

### ❌ "JSON data file not found"

**الحل:** تأكد من:

1. تشغيل السكريبت في Illustrator أولاً
2. اسم ملف AI واسم الـ Layer في AE متطابقان
3. الملف `.json` موجود في نفس مجلد ملف `.ai`

### ❌ "Please select or open a Composition first"

**الحل:** افتح أو أنشئ Composition في After Effects

### ❌ الخط لا يظهر بشكل صحيح

**الحل:** تأكد أن الخط المستخدم في Illustrator موجود ومثبّت في نظام التشغيل

### ❌ المواقع غير دقيقة

**الحل:** تأكد أن:

1. حجم الـ Comp في AE = حجم الـ Artboard في AI
2. النصوص داخل حدود الـ Artboard النشط في Illustrator

---

## 📁 ملفات المشروع

```
Text2Ae/
├── Text2Ae.jsx          ← السكريبت الموحد (استخدم هذا)
├── Text2Ae(AI).jsx      ← سكريبت Illustrator القديم (اختياري)
├── Text2Ae(AE).jsx      ← سكريبت After Effects القديم (اختياري)
└── README.md            ← هذا الملف
```

**ملاحظة:** يمكنك حذف الملفات القديمة `Text2Ae(AI).jsx` و `Text2Ae(AE).jsx` واستخدام `Text2Ae.jsx` فقط.

---

## 💡 نصائح

1. **احفظ ملف Illustrator دائماً** قبل Export
2. **حدد الـ Layer** في After Effects قبل الضغط على Import
3. **استخدم نفس الأسماء** لملف AI والـ Layer في AE
4. للحصول على أفضل النتائج، اجعل حجم Comp = حجم Artboard
5. النصوص متعددة الأسطر مدعومة بالكامل

---

## 🆕 الإصدار الحالي

**v2.0 - Universal Script**

- دمج السكريبتات في ملف واحد
- واجهة مستخدم محسّنة في After Effects
- رسائل خطأ واضحة بالعربية والإنجليزية
- دعم كامل للنصوص العربية والأحرف الخاصة

---

## 📧 الدعم

إذا واجهت أي مشكلة، تأكد من:

1. حفظ ملف Illustrator
2. تطابق أسماء الملفات
3. وجود الخطوط في النظام

---

**صُنع بـ ❤️ لمجتمع المصممين العرب**
