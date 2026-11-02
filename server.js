require("dotenv").config();
const express=require("express"), path=require("path"), OpenAI=require("openai");
const app=express(); app.use(express.json({limit:"2mb"})); app.use(express.static(path.join(__dirname,"public")));
const roles=[
["مدير المشاريع","تقسيم الطلب إلى مراحل"],["محلل المتطلبات","استخراج الوظائف"],["مهندس تجربة المستخدم","تدفق المستخدم"],["مصمم الواجهات","الهوية البصرية"],["مهندس Frontend","الواجهات"],["مهندس Backend","منطق الخادم"],["مهندس قواعد البيانات","الجداول والعلاقات"],["مهندس API","واجهات التكامل"],["مهندس التجارة الإلكترونية","السلة والطلبات"],["مهندس التطبيقات","تطبيقات الويب والموبايل"],["مهندس AI","إمكانات الذكاء الاصطناعي"],["مهندس الأمن","مراجعة الأمان"],["مهندس الاختبارات","اختبارات الوظائف"],["مهندس الأداء","تحسين الأداء"],["مهندس DevOps","تجهيز النشر"],["المراجع النهائي","مراجعة شاملة"]];
app.get("/api/status",(req,res)=>res.json({configured:!!process.env.OPENAI_API_KEY,model:process.env.OPENAI_MODEL||"gpt-4.1-mini",agents:16}));
app.post("/api/build",async(req,res)=>{
 const prompt=String(req.body.prompt||"").trim(); if(prompt.length<10)return res.status(400).json({error:"اكتب وصفًا واضحًا للمشروع."});
 if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"لم يتم ضبط مفتاح OpenAI API. انسخ .env.example إلى .env وأضف المفتاح لتفعيل الذكاء الاصطناعي الحقيقي."});
 try{const ai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
 const completion=await ai.chat.completions.create({model:process.env.OPENAI_MODEL||"gpt-4.1-mini",response_format:{type:"json_object"},messages:[
 {role:"system",content:`أنت فريق من 16 تخصص ذكاء اصطناعي. أعد JSON صالح باللغة العربية: {"projectName":"اسم","summary":"ملخص","pages":["صفحات"],"architecture":"بنية","tasks":[{"agent":"الدور","task":"المهمة","deliverable":"المخرج"}],"files":[{"path":"مسار","content":"الكود"}],"tests":["اختبار"],"deployment":"خطوات نشر","risks":["مخاطر"]}. أنشئ مخرجات عملية وملفات مشروع صغيرة قابلة للتشغيل إن طلب موقعًا. لا تدّع نشره فعليًا. الأدوار: ${roles.map((r,i)=>`${i+1}-${r[0]}: ${r[1]}`).join("؛ ")}. الحد الأقصى 8 ملفات. راعِ الأمان.`},
 {role:"user",content:prompt}]});
 const data=JSON.parse(completion.choices[0].message.content); data.agents=roles.map(r=>({name:r[0],status:"completed",task:(data.tasks||[]).find(t=>t.agent===r[0])?.task||r[1]})); data.notice="تم توليد المخرجات عبر API. النشر الفعلي يتطلب إعداد استضافة ومراجعة أمان."; res.json(data);
 }catch(e){console.error(e);res.status(500).json({error:"تعذر التوليد: "+e.message});}
});
app.listen(process.env.PORT||3000,()=>console.log("AI ENGINEERS 16 on "+(process.env.PORT||3000)));
