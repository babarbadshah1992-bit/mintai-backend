import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  // CORS fix
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {

    // 🔹 GET → check connection
    if (req.method === 'GET') {

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .limit(5)

      if (error) {
        return res.status(500).json({ error })
      }

      return res.status(200).json({
        message: "Supabase Connected ✅",
        data
      })
    }

    // 🔹 POST → insert blog
    if (req.method === 'POST') {

      const { title, content } = req.body

      const { data, error } = await supabase
        .from('blogs')
        .insert([
          {
            title,
            slug: title.toLowerCase().replace(/\s+/g, '-'),
            content,
            meta_description: content.substring(0, 100),
            category: "General"
          }
        ])

      if (error) {
        return res.status(500).json({ error })
      }

      return res.status(200).json({
        message: "Blog inserted successfully 🚀",
        data
      })
    }

    return res.status(405).json({ message: "Method Not Allowed" })

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
