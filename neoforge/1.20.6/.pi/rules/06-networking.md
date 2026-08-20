---
description: 06 — 网络（NeoForge 1.20.6）
---

# 06 — 网络（NeoForge 1.20.6）

**本档不是 Forge SimpleChannel。**

来源：本档 `search_neoforge_docs` **没有** `networking/payload` 页（`get_neoforge_doc_full id=networking/payload` 返回 `DOC_NOT_FOUND`）。

网络 Payload API 未核实。禁止输出 `RegisterPayloadHandlersEvent` / `playBidirectional` / `DirectionalPayloadHandler` 等 1.21 族签名。用 `search_neoforge_docs query=networking version=1.20.6`；若仍无 payload 页则停。不要改成 1.21 复数 Handlers，不要用 1.21.8 DirectionalPayloadHandler 回填。

禁止：`SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel`；无 docs 却编造类名。
