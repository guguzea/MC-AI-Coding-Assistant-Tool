---
description: 08 — 物理端（NeoForge 1.20.4）
---

# 08 — 物理端（NeoForge 1.20.4）

来源：https://docs.neoforged.net/docs/1.20.4/concepts/sides/

- 物理客户端 / 物理服务端 / 逻辑客户端 / 逻辑服务端 分开。
- 客户端类：`Dist.CLIENT` + `@EventBusSubscriber`。MDK 1.20.4 用内部类 `ClientModEvents`。
- 禁止在服务端线程碰 `Minecraft.getInstance()`。
- 网络处理线程：1.20.4 payload 默认**网络线程**，切主线程用 `workHandler().submitAsync`。1.21+ 默认主线程，重计算用 `HandlerThread.NETWORK` + `enqueueWork`。
