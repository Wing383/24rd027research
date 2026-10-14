import { useState } from 'react'
import { initialElements, moveElement, sizeLabels, updateElement } from './uiElements'
import type { ElementSize, UIElement } from './uiElements'
import './App.css'

function App() {
  // state は、操作によって変化するデータをReactに覚えてもらう仕組みです。
  const [elements, setElements] = useState<UIElement[]>(initialElements)
  // null は「まだ何も選んでいない」という意味です。
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [message, setMessage] = useState('まずは、プレビューの要素を選んでみましょう。')

  // 選択中の要素はIDから探します。同じ情報を別のstateに重複して保存しません。
  const selected = elements.find((element) => element.id === selectedId)
  const visibleElements = elements.filter((element) => element.visible)
  const visibleIndex = visibleElements.findIndex((element) => element.id === selectedId)

  function selectElement(element: UIElement) {
    setSelectedId(element.id)
    setMessage(`「${element.label}」を選択しました。`)
  }

  function changeSize(direction: -1 | 1) {
    if (!selected) return
    const sizes: ElementSize[] = ['small', 'medium', 'large']
    const nextSize = sizes[sizes.indexOf(selected.size) + direction]
    if (!nextSize) return
    setElements((current) => updateElement(current, selected.id, { size: nextSize }))
    setMessage(`「${selected.label}」のサイズを「${sizeLabels[nextSize]}」にしました。`)
  }

  function changeVisibility(visible: boolean) {
    if (!selected) return
    setElements((current) => updateElement(current, selected.id, { visible }))
    setMessage(`「${selected.label}」を${visible ? '表示' : '非表示に'}しました。`)
  }

  function moveSelected(direction: -1 | 1) {
    if (!selected) return
    setElements((current) => moveElement(current, selected.id, direction))
    setMessage(`「${selected.label}」を1つ${direction === -1 ? '上' : '下'}に移動しました。`)
  }

  function resetLayout() {
    setElements(initialElements)
    setSelectedId(null)
    setMessage('サイズ・表示・並び順を最初の状態に戻しました。')
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">UI CUSTOMIZATION LAB / 01</p>
          <h1>自分で変える、インターフェース。</h1>
          <p className="intro">要素を選んで、サイズ・表示・並び順を試してみましょう。</p>
        </div>
        <span className="prototype-label">研究用プロトタイプ</span>
      </header>

      <div className="workspace">
        <section className="preview-panel" aria-labelledby="preview-heading">
          <div className="panel-heading">
            <div><p className="eyebrow">01 / PREVIEW</p><h2 id="preview-heading">実験用の画面</h2></div>
            <span className="count-label">{visibleElements.length} / {elements.length} 表示中</span>
          </div>
          <p className="hint">検索欄・ボタン・カードをクリックすると選択できます。検索や画面遷移は行いません。</p>

          <div className="preview-elements">
            {visibleElements.map((element) => (
              <div key={element.id} className={`preview-item size-${element.size} ${selectedId === element.id ? 'is-selected' : ''}`}>
                {element.kind === 'search' ? (
                  <label className="search-element">
                    <span className="element-caption">検索欄</span>
                    <input type="search" placeholder="キーワードを入力" aria-label="検索欄"
                      onFocus={() => selectElement(element)} onClick={() => selectElement(element)} />
                  </label>
                ) : (
                  <button type="button" className={`selectable ${element.kind}`}
                    aria-pressed={selectedId === element.id} onClick={() => selectElement(element)}>
                    {element.kind === 'card' && <span className="element-caption">RESEARCH NOTE</span>}
                    <span className="element-title">{element.label}</span>
                    {element.description && <span className="element-description">{element.description}</span>}
                  </button>
                )}
                {selectedId === element.id && <span className="selection-badge">選択中</span>}
              </div>
            ))}
            {visibleElements.length === 0 && <p className="empty-state">すべて非表示です。要素一覧で選んで「表示する」を押すと戻せます。</p>}
          </div>
        </section>

        <aside className="control-panel" aria-labelledby="control-heading">
          <p className="eyebrow">02 / CUSTOMIZE</p>
          <h2 id="control-heading">選んで、変えてみる</h2>
          <label className="field-label" htmlFor="element-picker">要素一覧</label>
          <select id="element-picker" value={selectedId ?? ''} onChange={(event) => {
            const element = elements.find((item) => item.id === event.target.value)
            if (element) selectElement(element)
          }}>
            <option value="" disabled>要素を選んでください</option>
            {elements.map((element) => <option key={element.id} value={element.id}>
              {element.label}{element.visible ? '' : '（非表示）'}
            </option>)}
          </select>
          <p className="hint">非表示の要素も、この一覧から選び直せます。</p>

          <div className="selected-summary">
            <span className="field-label">選択中の要素</span>
            <strong>{selected?.label ?? 'まだ選択されていません'}</strong>
            <span>{selected ? `サイズ：${sizeLabels[selected.size]} / ${selected.visible ? '表示中' : '非表示'}` : '左の画面、または要素一覧から選択'}</span>
          </div>

          <fieldset disabled={!selected}>
            <legend>サイズ</legend>
            <div className="button-pair">
              <button type="button" disabled={selected?.size === 'small'} onClick={() => changeSize(-1)}>− 小さくする</button>
              <button type="button" disabled={selected?.size === 'large'} onClick={() => changeSize(1)}>＋ 大きくする</button>
            </div>
          </fieldset>
          <fieldset disabled={!selected}>
            <legend>表示</legend>
            <div className="button-pair">
              <button type="button" disabled={!selected?.visible} onClick={() => changeVisibility(false)}>非表示にする</button>
              <button type="button" disabled={selected?.visible} onClick={() => changeVisibility(true)}>表示する</button>
            </div>
          </fieldset>
          <fieldset disabled={!selected || !selected.visible}>
            <legend>並び順</legend>
            <div className="button-pair">
              <button type="button" disabled={visibleIndex <= 0} onClick={() => moveSelected(-1)}>↑ 上に移動する</button>
              <button type="button" disabled={visibleIndex < 0 || visibleIndex >= visibleElements.length - 1} onClick={() => moveSelected(1)}>↓ 下に移動する</button>
            </div>
          </fieldset>

          <p className="status-message" role="status">{message}</p>
          <button type="button" className="reset-button" onClick={resetLayout}>最初の状態に戻す</button>
          <p className="hint footnote">変更はこの画面を開いている間だけ有効です。再読み込みすると元に戻ります。</p>
        </aside>
      </div>
      <footer>STEP 1–4 <span>クリックで選択 → ボタンで変更</span></footer>
    </main>
  )
}

export default App
