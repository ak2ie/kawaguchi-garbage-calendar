# アップデート手順

これはChrome拡張を修正後、WebStoreで公開するまでの手順をまとめたものです。

# バージョンアップ
修正度合いに応じて、コマンドによりバージョンアップする。
```
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 ```

# 機能紹介のテキストを書く
この拡張はインストールまたはバージョンアップ後に、川口市のゴミカレンダーを開くと、追加機能の紹介を表示する。

紹介文は下記の場所から取得するようになっているので、これを書き換える。

## 紹介文が書かれているファイルを開く
 - `app\scripts\contentscript.ts`

## 紹介文を追加する
`notifyFeature`関数内にある`message`変数に追加する。

```javascript
message = {
    'バージョン': '紹介文'
}
```

# デバッグ用コードを除去
下記のファイルにあるデバッグ用コードを除去する

 - `app/scripts/background.ts` : `import 'chromereload/devonly'`
 - `app/scripts/GarbageCaledar.ts` : `import 'chromereload/devonly'`
 - `app/scripts/options.ts` : `import 'chromereload/devonly'`

# ビルドする
```
npm run build
```

# アップロードファイルを確認
下記のフォルダに、アップロードするzipファイルが出力されたことを確認する。
 - `packages`

`kawaguchi-garbage-calendar-<バージョン>-chrome.zip`が存在することを確認する。


もし出力されていなければ、下記のフォルダを右クリックし、Windowsの標準機能からZip圧縮する

 - `dist/chrome`

# WebStoreから公開する
[WebStore](https://chrome.google.com/webstore?hl=ja)を開き公開する