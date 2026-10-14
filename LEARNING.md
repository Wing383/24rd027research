# UIカスタマイズ試作：Step 1〜4

## 起動

このファイルと package.json があるフォルダで `npm run dev` を実行し、表示された Local のURLを開きます。
検索欄や各ボタンは、今回はUI変更の実験対象です。検索・おすすめ取得・履歴表示・設定画面への移動はまだ行いません。
文字命令の入力・AI API・データ保存も今後の段階です。ページを再読み込みすると変更は消えます。

## Step 1：既存の環境を使う

React + TypeScript + Vite は作成済みなので、そのまま使っています。ライブラリの追加はありません。
`src/main.tsx` が App を読み込み、`index.html` の root に表示します。

## Step 2：データから画面を作る

まず `src/uiElements.ts` の UIElement と initialElements を読んでください。
UIElement は要素が持つ情報の型です。id は要素の識別子、label は表示名、kind は種類、size は大きさ、visible は表示するかどうかを表します。
`'small' | 'medium' | 'large'` は、その3つの文字列だけを許す「ユニオン型」です。`boolean` は true / false の2択です。
`description?: string` の ? は「説明文はなくてもよい」という意味です。

App.tsx の `visibleElements.map(...)` が、表示中の要素ごとに画面を作ります。
`key={element.id}` は、並び順が変わってもReactが同じ要素を識別するために必要です。
CSSが色・余白・サイズを担当します。

## Step 3：選択を覚える

```tsx
const [selectedId, setSelectedId] = useState<string | null>(null)
```

- selectedId：今選ばれている要素のID。
- setSelectedId：IDを変更するための関数。
- useState：画面に関係するデータをReactに覚えてもらう仕組み。
- string | null：IDの文字列、または未選択を表す null。

クリック時に selectElement が呼ばれ、setSelectedId でIDを保存します。
Reactが再描画し、そのIDと一致する要素に選択枠を付けます。
検索欄はフォーカスでも選択できます。ボタンとカードはTabで移動し、EnterまたはSpaceでも選べます。

## Step 4：選択した要素を変更する

```tsx
const [elements, setElements] = useState<UIElement[]>(initialElements)
```

UIElement[] は「UIElementの配列」です。要素のサイズ・表示・順番をまとめて覚えます。
selected は elements からIDで探します。選択要素のコピーを別のstateに持たないので、変更後の情報との食い違いを避けられます。

例：changeVisibility(false) → updateElement が visible を false にした新しい配列を作る → setElements に渡す → 再描画で非表示になります。
`{ ...element, ...changes }` は元の情報をコピーし、一部を上書きした新しいオブジェクトです。
`setElements((current) => ...)` は直前のstateを受け取って次のstateを計算する書き方です。
state内の元の配列やオブジェクトを直接変更しないことがポイントです。

updateElement の `Partial<Pick<UIElement, 'size' | 'visible'>>` は「sizeとvisibleだけを変更でき、片方だけ渡してもよい」という型です。
moveElement の direction は -1（上）か 1（下）だけを受け取ります。配列をコピーし、隣の表示中の要素と交換します。

## 動作を確かめる順番

1. 未選択では変更ボタンが無効になっていることを確認する。
2. おすすめを選んで大きくする。選択したものだけ変わり、最大サイズでボタンが無効になることを確認する。
3. 小さくする。小・中・大の3段階を確認する。
4. 非表示にする。要素一覧から別の要素を選び、その後おすすめを選び直して「表示する」で戻す。
5. 上下に移動する。一番上・一番下ではそれ以上動かせないことを確認する。非表示の要素は飛ばして移動する。
6. 全要素を非表示にし、一覧から1つを選んで表示を戻す。
7. 最初の状態に戻す。順序・サイズ・表示・選択が初期状態に戻ることを確認する。
8. 幅の狭い画面でも操作パネルを使えることを確認する。

## 次の学習

まずは選択IDのstateと、サイズを変える関数を1つずつ追ってください。
その後、文字列の指示を解釈して同じUI更新処理を呼ぶ段階へ進められます。

参考：[React公式・配列のstate更新](https://react.dev/learn/updating-arrays-in-state)
