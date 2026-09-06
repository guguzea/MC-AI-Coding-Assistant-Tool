---
description: 08 — 物理端（NeoForge 1.21.5）
---

# 08 — 物理端（NeoForge 1.21.5）

来源：https://docs.neoforged.net/docs/1.21.5/concepts/sides/
> ⚠️ 离线数据缺口：本档 data/neoforge_1.21.5/ 未入库 concepts/sides 页，search_neoforge_docs 查不到；上述来源以线上版为准（禁止从邻版复制补索引）。

- 物理 / 逻辑四端分开。物理 `Dist`，逻辑 `LogicalSide`。
- 逻辑端：`level.isClientSide()`。
- 物理端：`FMLEnvironment.dist`。文档推荐 `@Mod(value = MODID, dist = Dist.CLIENT)` 客户端入口。
- 跨端必须发包。禁止服务端线程碰 `Minecraft.getInstance()`。
- 网络：本档 payload **默认主线程**；重计算 `HandlerThread.NETWORK` + `enqueueWork`（见 06）。不要抄 1.20.6「默认网络线程」。
