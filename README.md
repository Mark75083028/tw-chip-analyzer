# 台股題材籌碼排名工具

本工具提供 AI / 低軌衛星題材股票池排名，後端會抓 TWSE / TPEx 公開資料，前端顯示籌碼分數、星等評比、明日猜漲跌、勝率與連勝紀錄。

## 本機啟動

```powershell
npm start
```

開啟：

```text
http://127.0.0.1:8766/
```

## 部署到 Render

1. 把整個專案資料夾上傳到 GitHub。
2. 到 Render 建立 New Web Service。
3. 選擇這個 GitHub repo。
4. Render 會讀取 `render.yaml`。
5. 部署完成後，用 Render 給你的網址開啟工具。

## 注意

- 公開資料通常是盤後更新，不一定和券商盤中資訊同步。
- 勝率與連勝目前存在瀏覽器 localStorage；換裝置會重新統計。
- `work/tw-chip-data.json` 是本機快取資料，雲端免費平台可能重啟後清空；正式使用可再改接資料庫。
