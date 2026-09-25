import { NextRequest } from "next/server"
import OpenAI from "openai"
import { supabase } from "@/lib/supabase"
import { curriculum } from "@/data/curriculum" // our NO TERM file

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function GET(req: NextRequest){
  const batch = Number(req.nextUrl.searchParams.get("batch") || "0")

  // Same logic as your generate-all - get batch of PDFs from Source PDFs
  const { data: allPdfs } = await supabase.storage.from("source-pdfs").list("", { limit: 200 })
  const batchSize = 3 // 103 PDFs / 45 batches ≈ 2-3 per batch
  const pdfs = allPdfs?.slice(batch*batchSize, (batch+1)*batchSize) || []

  let totalQuestions = 0

  for (const pdfFile of pdfs) {
    const { data: url } = await supabase.storage.from("source-pdfs").createSignedUrl(pdfFile.name, 3600)

    // Extract text from PDF via OpenAI
    const resp = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: `Extract EXAM QUESTIONS from this PDF: ${pdfFile.name}.
        Use curriculum: ${JSON.stringify(curriculum)}
        NO TERM - use format: Subject > Unit > Topic (e.g. Mathematics > Differential Calculus > First Principles)
        Return JSON: {questions: [{question_text, subject, unit, topic, marks, type, correct_answer, explanation, difficulty_l, difficulty_label}]}
        difficulty_l: L1-L5, difficulty_label: Easy/Medium/Hard/Exam Style
        PDF URL: ${url?.signedUrl}`
      }],
      response_format: { type: "json_object" }
    })

    const parsed = JSON.parse(resp.choices[0].message.content || "{}")
    const questions = parsed.questions || []

    for (const q of questions) {
      await supabase.from("questions").insert({
        question_text: q.question_text,
        subject: q.subject,
        unit: q.unit,
        topic: q.topic,
        topic_path: `${q.subject} > ${q.unit} > ${q.topic}`, // NO TERM
        difficulty_l: q.difficulty_l,
        difficulty_label: q.difficulty_label,
        marks: q.marks,
        type: q.type || "LONG_QUESTION",
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        access: "Free",
        source_pdf: pdfFile.name
      })
    }
    totalQuestions += questions.length
  }

  return Response.json({
    batch,
    questions_created: totalQuestions,
    source_pdfs: pdfs.length
  })
}
