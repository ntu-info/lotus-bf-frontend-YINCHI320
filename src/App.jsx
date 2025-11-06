
import { useCallback, useRef, useState } from 'react'
import { Terms } from './components/Terms'
import { QueryBuilder } from './components/QueryBuilder'
import { Studies } from './components/Studies'
import { NiiViewer } from './components/NiiViewer'
import { useUrlQueryState } from './hooks/useUrlQueryState'
import './App.css'

export default function App () {
  const [query, setQuery] = useUrlQueryState('q')

  const handlePickTerm = useCallback((t) => {
    setQuery((q) => (q ? `${q} ${t}` : t))
  }, [setQuery])

  // --- resizable panes state ---
  const gridRef = useRef(null)
  const [sizes, setSizes] = useState([28, 44, 28]) // [left, middle, right]
  const MIN_PX = 240

  const startDrag = (which, e) => {
    e.preventDefault()
    const startX = e.clientX
    const rect = gridRef.current.getBoundingClientRect()
    const total = rect.width
    const curPx = sizes.map(p => (p / 100) * total)

    const onMouseMove = (ev) => {
      const dx = ev.clientX - startX
      if (which === 0) {
        let newLeft = curPx[0] + dx
        let newMid = curPx[1] - dx
        if (newLeft < MIN_PX) { newMid -= (MIN_PX - newLeft); newLeft = MIN_PX }
        if (newMid < MIN_PX) { newLeft -= (MIN_PX - newMid); newMid = MIN_PX }
        const s0 = (newLeft / total) * 100
        const s1 = (newMid / total) * 100
        const s2 = 100 - s0 - s1
        setSizes([s0, s1, Math.max(s2, 0)])
      } else {
        let newMid = curPx[1] + dx
        let newRight = curPx[2] - dx
        if (newMid < MIN_PX) { newRight -= (MIN_PX - newMid); newMid = MIN_PX }
        if (newRight < MIN_PX) { newMid -= (MIN_PX - newRight); newRight = MIN_PX }
        const s1 = (newMid / total) * 100
        const s2 = (newRight / total) * 100
        const s0 = (curPx[0] / total) * 100
        setSizes([s0, s1, Math.max(s2, 0)])
      }
    }
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div className="app">
      {/* Inline style injection to enforce no-hover look */}
      <style>{`
        :root {
          --primary-600: #2563eb;
          --primary-700: #1d4ed8;
          --primary-800: #1e40af;
          --border: #e5e7eb;
        }
        .app {
          padding-right: 0 !important;
          background-color: #DDDDFF; /* 改變背景顏色 */
          /* 新增：使用現代、易讀的系統字體 */
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang TC", "Microsoft JhengHei", sans-serif;
        }
        .app__grid > .card { /* 鎖定那三個主要的卡片 */
          border: 1px solid var(--border);
          border-radius: 12px; /* 新增：圓角 */
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 新增：陰影 */
          background: #ffffff; /* 新增：確保卡片是白色 */
        }
        .app__grid { width: 100vw; max-width: 100vw; }
        .card input[type="text"],
        .card input[type="search"],
        .card input[type="number"],
        .card select,
        .card textarea {
          width: 100% !important;
          max-width: 100% !important;
          display: block;
        }
        /* Downsized buttons */
        .card button,
        .card [role="button"],
        .card .btn,
        .card .button {
          font-size: 12px !important;
          padding: 4px 8px !important;
          border-radius: 8px !important;
          line-height: 1.2 !important;
          background: var(--primary-600) !important;
          color: #fff !important;
          border: none !important;
        }
        /* --- 新增：按鈕互動效果 --- */
        .card button:hover,
        .card [role="button"]:hover,
        .card .btn:hover,
        .card .button:hover {
          background: var(--primary-700) !important; /* 變更：懸停時加深藍色 */
          transform: translateY(-1px); /* 新增：輕微上浮 */
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2); /* 新增：藍色光暈 */
        }
        .card button:active,
        .card [role="button"]:active,
        .card .btn:active,
        .card .button:active {
          background: var(--primary-800) !important; /* 變更：點擊時更深 */
          transform: translateY(0);
          box-shadow: none;
        }
        /* Toolbars / chips also no-hover */
        .card .toolbar button,
        .card .toolbar [role="button"],
        .card .toolbar .btn,
        .card .toolbar .button,
        .card .qb-toolbar button,
        .card .qb-toolbar [role="button"],
        .card .qb-toolbar .btn,
        .card .qb-toolbar .button,
        .card .query-builder button,
        .card .query-builder [role="button"],
        .card .query-builder .btn,
        .card .query-builder .button,
        .card .chip,
        .card .pill,
        .card .tag {
          background: var(--primary-600) !important;
          color: #fff !important;
          border: none !important;
        }
        .card .toolbar button:hover,
        .card .qb-toolbar button:hover,
        .card .query-builder button:hover,
        .card .chip:hover,
        .card .pill:hover,
        .card .tag:hover,
        .card .toolbar button:active,
        .card .qb-toolbar button:active,
        .card .query-builder button:active {
          background: var(--primary-600) !important;
          color: #fff !important;
        }
        /* Disabled stays same color but dimmer for affordance */
        .card .toolbar button:disabled,
        .card .qb-toolbar button:disabled,
        .card .query-builder button:disabled,
        .card button[disabled],
        .card [aria-disabled="true"] {
          background: var(--primary-600) !important;
          color: #fff !important;
          opacity: .55 !important;
        }
        
        # 新增
        .app__header { padding-bottom: 12px; }
        .app__description {
          font-size: 14px;
          color: #555;
          margin: 8px 0 0 0;
          max-width: 600px; /* 讓文字不要太寬 */
        }
        .app__description code {
          font-family: monospace;
          background: #eee;
          padding: 2px 4px;
          border-radius: 4px;
        }
        .example-queries {
          padding: 8px 12px;
          font-size: 13px;
        }
        .example-queries strong {
          display: block;
          margin-bottom: 6px;
          color: #333;
        }
        .example-queries button {
          font-size: 12px !important; /* Override existing button style */
          padding: 4px 8px !important;
          margin-right: 6px;
          margin-bottom: 6px;
          background: #f4f4f5 !important; /* 淺灰色背景 */
          color: var(--primary-700) !important; /* 藍色文字 */
          border: 1px solid var(--border) !important;
          cursor: pointer;
        }
        .example-queries button:hover {
          background: #e4e4e7 !important; /* 滑鼠懸停時變深 */
          color: var(--primary-800) !important;
        }
        .example-queries button code {
          font-family: monospace;
          background: transparent !important;
          padding: 0 !important;
        }
        # 

      `}</style>

      <header className="app__header">
        <h1 className="app__title">LoTUS-BF</h1>
        <div className="app__subtitle">Location-or-Term Unified Search for Brain Functions</div>
        <p className="app__description">
          Search the brain function database using keywords (e.g., "reward") or MNI coordinates (e.g., <code>[-2, 50, -6]</code>).
        </p>
      </header>

      <main className="app__grid" ref={gridRef}>
        <section className="card" style={{ flexBasis: `${sizes[0]}%` }}>
          <div className="card__title">Terms</div>
          <Terms onPickTerm={handlePickTerm} />
        </section>

        <div className="resizer" aria-label="Resize left/middle" onMouseDown={(e) => startDrag(0, e)} />

        <section className="card card--stack" style={{ flexBasis: `${sizes[1]}%` }}>
          <QueryBuilder query={query} setQuery={setQuery} />

          <div className="example-queries">
            <strong>Try an example:</strong>
            <button onClick={() => setQuery('[-2,50,-6] AND reward')}>
              <code>[-2,50,-6] AND reward</code>
            </button>
            <button onClick={() => setQuery('([30,-60,50] OR [40,-50,45]) AND default mode')}>
              <code>DMN Coordinates</code>
            </button>
            <button onClick={() => setQuery('[-2,50,-6] NOT "ventromedial prefrontal"')}>
              <code>Keyword NOT</code>
            </button>
        </div>

          {/* <div className="hint">Current Query：<code className="hint__code">{query || '(empty)'}</code></div> */}
          <div className="divider" />
          <Studies query={query} />
        </section>

        <div className="resizer" aria-label="Resize middle/right" onMouseDown={(e) => startDrag(1, e)} />

        <section className="card" style={{ flexBasis: `${sizes[2]}%` }}>
          <NiiViewer query={query} />
        </section>
      </main>
    </div>
  )
}
