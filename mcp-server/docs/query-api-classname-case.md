# query_api suggestions 的类名大小写还原（维护注意）

适用范围：`query_api` 未命中时返回的 `suggestions`（「你指的是 … 吗？」）。
**不影响** 精确命中判定、`methods`、`convert_mapping`、`query_loader_api`。

## 背景：为什么曾经输出全小写

类名前缀 trie 的键是**小写段**——`src/workers/preloader.ts` 的 `buildTrieIndex()` 按
`name.toLowerCase().split("/")` 建树（`:87`），`TrieNodeFlat` 不保留原始大小写字段。
于是 `TrieIndex._collect()` 只能用小写段拼回名字，`fuzzyClassSearch()` 的 prefix 分支
（`kind:"prefix"`）拿到的就是 `com/mojang/blaze3d/blaze3d` 这种 destroyed-case 串。

原始大小写唯一的来源是 `vData.classNames`（直接来自 `data/forge_<ver>/extracted/class-names.json`）。
线性兜底分支本来就在遍历 `classNames`，所以那条路径一直是对的；只有 trie 分支会毁大小写。

## 现在的做法（最小侵入）

在**查询层**还原，不动 trie、不动 worker 协议、不动序列化格式、不动任何公共工具签名：
`src/api/index.ts` 的 `fuzzyClassSearch()` 里用 `classNames` 建一张
`小写全名 → 原始全名` 的 `Map`，两条 prefix 分支（`score 95` / `score 90`）出口各过一遍
`restoreCase()`。查不到就原样返回（`?? lowerName`），不会抛错。

`VersionData` 因此多了一个可选内部字段 `caseMap`，仅用于缓存，不参与任何返回结构。

## ⚠️ 缓存绑定的是「数组身份」，不是内容

`caseMap` 记录着构建时所用的 `classNames` 数组引用，只有引用变了才重建：

```ts
let caseMap = vData.caseMap && vData.caseMap.names === names ? vData.caseMap.map : undefined;
```

选这个策略是为了省掉在三条赋值路径上手动 invalidate。代价是一条**隐含不变量**：

> **`vData.classNames` 只能被整体替换，不能原地修改（`push` / `splice` / 按下标赋值）。**

- 当前成立：worker 回灌（`vData.classNames = msg.classNames`）与懒加载
  （`= parseJsonUtf8(...)` / 失败时 `= []`）合计 4 处赋值，全是整体替换；初始值也是 `[]` 字面量。
  另注意 worker `postMessage` 走结构化克隆，主线程拿到的已经是新数组，身份与 worker 内部那个无关。
- 若将来有人原地追加，症状是**静默**的：新增类在 suggestions 里回退成全小写，
  老类照常；`found` 判定、`methods`、`classCount` 都不受影响，所以不会报错也不会有人立刻发现。

改到这里之前先跑一次自查，确认赋值面没有变宽：

```bash
cd mcp-server && grep -n "classNames *=" src/api/index.ts
```

只应看到 `= msg.classNames` / `= parseJson...(...)` / `= []` 这类整体替换。一旦出现
`classNames.push(...)` 之类，三选一：改成整体替换（推荐）、把 `caseMap` 置 `null` 显式失效、
或改用长度+内容指纹作 key。别靠「反正现在没人这么写」。

## 回归门禁

`mcp-server/test-core.mjs`（`queryApi` 用例段内）用 `com.mojang` @ `1.20.4` 断言：
**每条 suggestion 必须原样存在于 `class-names.json`**。

刻意**不**钉死「应该返回哪 5 个类名」——那会随 trie 排序或数据增删偶发失败。
数据侧的不变量既抗抖动，又对变异敏感。

验证门禁真的拦得住（改完这段代码后请重跑一次）：

```bash
cd mcp-server && npm run build
# 临时把 dist/api/index.js 里的 restoreCase 改成恒等：
#   const restoreCase = (lowerName) => lowerName;
npm test; echo "RC=$?"          # 期望 RC=1，报 got: com.mojang.blaze3d.blaze3d
npm run build                   # 覆盖掉这处投毒（勿手改 src）
```

## 已知且刻意不改的行为

把被毁的 suggestion 再查一遍，**会**自动纠正成 `found:true`（`com.mojang.blaze3d.blaze3d`
→ `Blaze3D`），因为精确名不存在时会落到遍历 `classNames` 的线性兜底。

两个后果，都要记住：

1. 所以「反馈里说的名字不可再查」是**不准确**的表述，历史文档已按此订正；
2. 所以「把 suggestion 再查一遍断言 `found:true`」这种门禁是**空门禁**——有 bug 也能过。
   写这条链路的测试时，必须断言名字本身逐字存在，不能只断言能查到。

## 相关但不属于本文的地方

`suggestions` 的大小写还原不改变歧义策略：`Handler` 这类歧义简名仍然 `found:false` + 只给建议，
`Blck` 这类编辑距离近似不会被当命中（同一测试段另有断言）。
