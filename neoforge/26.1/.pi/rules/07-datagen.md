---
description: 07 — DataGen（NeoForge 26.1）
---

# 07 — DataGen（NeoForge 26.1）

来源：https://docs.neoforged.net/docs/resources/

事件：`GatherDataEvent.Client / GatherDataEvent.Server`。



先 `event.createDatapackRegistryObjects(...)`，再用 `event.createProvider(...)`。Client 可含全部 provider；Server 只含数据包。

不要用 1.12 `LanguageRegistry`。语言文件走 `LanguageProvider`。
