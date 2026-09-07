---
description: 08 — 物理端（NeoForge 1.21.1）
---

# 08 — 物理端（NeoForge 1.21.1）

来源：https://docs.neoforged.net/docs/1.21.1/concepts/sides/

- 物理客户端 / 物理服务端 / 逻辑客户端 / 逻辑服务端 分开。
- 物理端：`FMLEnvironment.dist`（`Dist.CLIENT` / `Dist.DEDICATED_SERVER`）。文档推荐另写 `@Mod(value = MODID, dist = Dist.CLIENT)` 的客户端入口类，不要在服务端加载 `net.minecraft.client`。
- 逻辑端：有 `Level` 时用 `level.isClientSide()`。
- 禁止在服务端线程碰 `Minecraft.getInstance()`。
- 网络处理线程：1.21+ payload 默认主线程；重计算用 `HandlerThread.NETWORK` + `enqueueWork`。1.20.4 才是默认网络线程 + `workHandler().submitAsync`。
