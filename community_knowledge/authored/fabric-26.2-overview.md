---
id: authored/fabric-26.2-overview
title: Fabric 26.2 概述（官方博客摘录）
tags: [26.2, fabric, loom, vulkan, porting]
summary: Loom 1.17 / Gradle 9.5.1；Vulkan 实验后端；BlockIds DataGen；gui.setScreen。短文不是 API 规范。
sourceKind: authored
url: https://fabricmc.net/2026/06/15/262.html
---

# Fabric 26.2 概述

依据 https://fabricmc.net/2026/06/15/262.html（2026-08-15 查阅）。禁止只放外链、禁止把整篇当已入库全文。

## 摘录

> 26.2 introduces the ability for the backend to be changed between the default OpenGL backend and an experimental Vulkan backend, with OpenGL planned to be removed once the Vulkan backend is stable.

> Developers should use Loom 1.17 and Gradle 9.5.1 (at the time of writing) to develop mods for Minecraft 26.2.

> The vanilla game now stores block ids and item ids seperately, in `BlockIds`, `BlockItemIds`, and `ItemIds`. These keys are used for data generation rather than the raw `Block` or `Item` instances. This necessitated the removal of `valueLookupBuilder`.

设屏：

```
- Minecraft.getInstance().setScreen()
+ Minecraft.getInstance().gui.setScreen()
```

博客还提到 enum extensions、tag `fabric:remove`、Fluid Interaction API、attended client commands。细节打开原文与 `search_fabric_docs`。

## 与文档树

- 已入库移植页 `develop_porting_index`（fabric_26.1.2）是 **到 26.1**。
- 26.2 移植旁路：`data/fabric_porting/26.2.md`，search id `porting/26.2`。
- **不要**建 `data/fabric_26.2` 克隆树。
