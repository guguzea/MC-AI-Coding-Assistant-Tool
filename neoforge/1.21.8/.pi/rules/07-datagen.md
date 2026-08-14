---
description: 07 — DataGen（NeoForge 1.21.8）
---

# 07 — DataGen（NeoForge 1.21.8）

来源：https://docs.neoforged.net/docs/1.21.8/resources/

事件：`GatherDataEvent.Client / GatherDataEvent.Server（已拆分）`。



先 `event.createDatapackRegistryObjects(...)`，再用 `event.createProvider(...)`。Client 可含全部 provider；Server 只含数据包。

不要用 1.12 `LanguageRegistry`。语言文件走 `LanguageProvider`。
