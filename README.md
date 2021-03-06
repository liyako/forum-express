# 餐廳評論網
使用者登入後可以瀏覽各種類餐廳、並進行評論。
管理者登入後可以對餐廳、分類、使用者進行管理。
# 功能描述
- 管理員登入後台新增/修改/刪除餐廳資料與分類
- 管理員可以登入後台修改使用者權限
- 使用者可以修改個人簡介
- 使用者可以查看其他使用者個人簡介
- 使用者可以追蹤其他使用者
- 使用者可以篩選餐廳分類
- 使用者可以加入/移除最愛餐廳至收藏清單
- 使用者可以Like/Unlike餐廳
- 使用者可以評論餐廳
- 使用者可以查看最新動態資訊
- 使用者可以點選Top10人氣餐廳查看收藏數高的餐廳
- 使用者可以點選美食達人查看追蹤人數高的使用者
# 專案畫面
![image](https://github.com/liyako/forum-express/blob/master/pic1.JPG)
# 執行步驟
- 下載專案
> git clone https://github.com/liyako/forum-express
- 進入資料夾
> cd restaurant_forum
- 下載套件
> npm install
- 安裝種子資料
> npm run seed
- 執行程式
> npm run dev

|                |帳號                            |密碼                         |
|----------------|-------------------------------|-----------------------------|
|       1.       |      user1@example.com        |        12345678             |
|       2.       |      user2@example.com        |        12345678             |
# 環境需求
- Node.js: v10.15.0
- Express: v4.17.1
- Express-Handlebars: v5.1.0
- body-parser: v1.19.0
- mysql2: v2.1.0
