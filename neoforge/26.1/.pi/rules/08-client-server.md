---
description: 08 — 物理端（NeoForge 26.1）
---

# 08 — 物理端（NeoForge 26.1）

来源：https://docs.neoforged.net/docs/concepts/sides/

- 物理客户端 / 物理服务端 / 逻辑客户端 / 逻辑服务端 分开。
- 物理端：本档是 **`FMLEnvironment#getDist()`**（不是更早档的 `FMLEnvironment.dist` 字段）。`Dist.CLIENT` / `Dist.DEDICATED_SERVER`。文档推荐 `@Mod(value = MODID, dist = Dist.CLIENT)` 客户端入口类。
- 逻辑端：`level.isClientSide()`。
- 禁止在服务端线程碰 `Minecraft.getInstance()`。
- 网络处理线程：payload 默认主线程；重计算用 `HandlerThread.NETWORK` + `enqueueWork`。
