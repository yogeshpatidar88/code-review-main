import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState(` function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState(``)

  useEffect(() => {
    prism.highlightAll()

    const leftSection = document.querySelector(".left")

    // 🔘 Add Copy Button and Char Count if not already present
    if (leftSection && !document.querySelector(".copy-btn")) {
      const copyBtn = document.createElement("div")
      copyBtn.className = "copy-btn"
      copyBtn.innerText = "Copy Code"
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.innerText = "Copied!"
          setTimeout(() => (copyBtn.innerText = "Copy Code"), 1500)
        })
      }

      const charCount = document.createElement("div")
      charCount.className = "char-count"
      charCount.innerText = `Chars: ${getCodeCharCount(code)}`

      leftSection.appendChild(copyBtn)
      leftSection.appendChild(charCount)
    }

    // 📜 Make scrollable wrapper for editor
    const codeContainer = document.querySelector(".code")
    if (codeContainer && !codeContainer.querySelector(".scroll-wrapper")) {
      const editorElement = codeContainer.firstChild
      const wrapper = document.createElement("div")
      wrapper.className = "scroll-wrapper"
      wrapper.appendChild(editorElement)
      codeContainer.appendChild(wrapper)
    }
  }, [])

  // Update count and button on code change
  useEffect(() => {
    const charCount = document.querySelector(".char-count")
    const copyBtn = document.querySelector(".copy-btn")

    if (charCount) {
      charCount.innerText = `Chars: ${getCodeCharCount(code)}`
    }

    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.innerText = "Copied!"
          setTimeout(() => (copyBtn.innerText = "Copy Code"), 1500)
        })
      }
    }
  }, [code])

  async function reviewCode() {
    const response = await axios.post('http://localhost:3000/ai/get-review', { code })
    setReview(response.data)
  }

  // ✅ Helper: count non-whitespace characters
  function getCodeCharCount(str) {
    return (str.match(/\S/g) || []).length
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className="review">Review</div>
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  )
}

export default App
