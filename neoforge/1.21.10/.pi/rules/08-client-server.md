---
description: 08 — 物理端（NeoForge 1.21.10）
---

# 08 — 物理端（NeoForge 1.21.10）

来源：https://docs.neoforged.net/docs/1.21.10/concepts/sides/
> ⚠️ 离线数据缺口：本档 data/neoforge_1.21.10/ 未入库 concepts/sides 页，search_neoforge_docs 查不到；上述来源以线上版为准（禁止从邻版复制补索引）。

- 物理 / 逻辑四端分开。物理 `Dist`，逻辑 `LogicalSide`。
- 逻辑端：`level.isClientSide()`。
- 物理端官方方法名是 **`FMLEnvironment#getDist()`**（`Dist.CLIENT` / `Dist.DEDICATED_SERVER`）。仍可用 `@Mod(value = MODID, dist = Dist.CLIENT)` 客户端入口。
- 跨端必须发包。禁止服务端线程碰 `Minecraft.getInstance()`。
- 网络：默认主线程；客户端发包是 **`ClientPacketDistributor.sendToServer`**（见 06），不是本档的 `PacketDistributor.sendToServer`。
