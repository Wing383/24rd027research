// type は「このデータに何を入れられるか」を決める設計図です。
export type ElementSize = 'small' | 'medium' | 'large'
export type UIElement = {
  id: string
  label: string
  kind: 'search' | 'button' | 'card'
  description?: string
  size: ElementSize
  visible: boolean
}

export const sizeLabels: Record<ElementSize, string> = {
  small: '小', medium: '中', large: '大',
}

// 配列の並び順を、そのまま画面の上から下への並び順に使います。
export const initialElements: UIElement[] = [
  { id: 'search', label: '検索欄', kind: 'search', size: 'medium', visible: true },
  { id: 'recommend', label: 'おすすめ', kind: 'button', size: 'medium', visible: true },
  { id: 'history', label: '履歴', kind: 'button', size: 'medium', visible: true },
  { id: 'settings', label: '設定', kind: 'button', size: 'medium', visible: true },
  { id: 'card-1', label: 'インタラクションの研究', kind: 'card', description: '人とコンピューターの関わり方を考える。', size: 'medium', visible: true },
  { id: 'card-2', label: '自分に合った画面', kind: 'card', description: '使いやすいサイズや配置を探してみよう。', size: 'medium', visible: true },
  { id: 'card-3', label: '小さく試して、学ぶ', kind: 'card', description: '操作して気づいたことを、次のアイデアに。', size: 'medium', visible: true },
]

// 元の配列を直接書き換えず、変更した要素を入れた新しい配列を返します。
export function updateElement(
  elements: UIElement[],
  id: string,
  changes: Partial<Pick<UIElement, 'size' | 'visible'>>,
): UIElement[] {
  return elements.map((element) =>
    element.id === id ? { ...element, ...changes } : element,
  )
}

// 非表示の要素を飛ばして、隣の「表示中の要素」と交換します。
export function moveElement(elements: UIElement[], id: string, direction: -1 | 1): UIElement[] {
  const index = elements.findIndex((element) => element.id === id)
  if (index === -1 || !elements[index].visible) return elements

  let neighbor = index + direction
  while (neighbor >= 0 && neighbor < elements.length && !elements[neighbor].visible) {
    neighbor += direction
  }
  if (neighbor < 0 || neighbor >= elements.length) return elements

  const nextElements = [...elements]
  ;[nextElements[index], nextElements[neighbor]] = [nextElements[neighbor], nextElements[index]]
  return nextElements
}
