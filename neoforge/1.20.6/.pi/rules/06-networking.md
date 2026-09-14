---
description: 06 — 网络（NeoForge 1.20.6）
---

# 06 — 网络（NeoForge 1.20.6）

**本档不是 Forge SimpleChannel。**

来源：本档**有** `networking/payload` 页 —— `get_neoforge_doc_full version=1.20.6 id=networking/payload` 实测 `ok:true`、正文 6978 字符（盘上件：`data/neoforge_1.20.6/neoforge-docs/1.20.6/processed/networking_payload.md`）。

该页正文实际出现的签名（按出现次数，逐字取自本页）：`CustomPacketPayload` ×8 · `RegisterPayloadHandlersEvent` ×3 · `PayloadRegistrar` ×3 · `StreamCodec` ×3 · `DirectionalPayloadHandler` ×2 · `playBidirectional` ×1 · `IPayloadContext` ×1。可以按页输出这些名字，但**页里没有的成员名一律不补**。

**更正（2026-09-13）**：本节原先写「本档没有 payload 页、返回 `DOC_NOT_FOUND`，禁止输出 `RegisterPayloadHandlersEvent` / `playBidirectional` / `DirectionalPayloadHandler`」—— 该前提与盘上语料相反，而且正好把本档唯一的一手证据禁掉了。仍然成立的告诫：不要把 1.20.6 的单数 `RegisterPayloadHandlersEvent` 写成 1.21 的复数 Handlers；不要用 1.21.8 的 `DirectionalPayloadHandler` 形态回填本页没写的东西。

禁止：`SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel`；无 docs 却编造类名。
