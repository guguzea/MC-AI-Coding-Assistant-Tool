---
mcHint: 全版本通用；spark 命令以官方文档为准
id: authored/profiling-performance
title: 性能分析与 profiler 实务
tags: [performance, profiler, spark, lag, memory]
summary: 模组性能排查实务：spark 集成与读数、/debug tick、内存诊断与常见泄漏面、「先测量后优化」清单。
sourceKind: authored
---

# 性能分析与 profiler 实务

自写实务短文。命令参数以 spark 官方文档与游戏内补全为准，本文不复制完整签名。

## 原则：先测量，后优化

1. 先确认症状类型：**tick 慢**（TPS 掉）/ **帧率低**（FPS 掉）/ **内存**（GC 频繁、OOM）。三者排查路径不同。
2. 上 profiler 拿证据（谁占了 tick/帧时间），再动代码。
3. 没有基线就没有结论：改动前后各采一次同样时长的样本。

## spark（服务端 tick / 内存）

- 官方文档与下载：<https://spark.lucko.me/>（支持 Forge / NeoForge / Fabric / Quilt，装为普通 mod）。
- 常用入口：`/spark profiler`（tick 采样，产出网页报告链接）、`/spark tps`（快速看 TTS/TPS 曲线）、`/spark gcmonitor`（GC 压力观察）。子命令以游戏内补全与官方文档为准。
- 读报告：按 Self 时间排序找热点；mod 代码的包名一眼可辨；平台/原生平铺的大头先别动。

## vanilla 自带：/debug tick

- `/debug start` → 复现卡顿 → `/debug stop`，产物在 `debug/` 下（profiling 与 chunk 信息）。
- 适合无 spark 的最小环境快速定性；交互体验不如 spark。

## 帧率（客户端）

- spark 亦有客户端 profiler（`/sparkc` 前缀，以官方文档为准）；或用 FPS 变化二分法定位：关实体渲染/关特定 mod 的渲染路径。
- 常见来源：BER/模型过复杂、每帧 `getTexture`/IO、粒子过量、GUI 每帧重建。

## 内存诊断

- 工具：JVM 自带（`jcmd GC.heap_info`、heap dump + VisualVM/Eclipse MAT）；spark 的 heapdump 入口亦可。
- 常见泄漏面（按命中率排）：
  1. **缓存只增不清**：以 `WeakHashMap` 名义存强引用 value、`Map` key 是世界对象却跨世界复用。
  2. **监听器/回调累积**：每次世界加载/玩家加入都 `register`，从不注销（Forge/Neo 事件总线按实例持有）。
  3. **Capability 未随方块实体失效**：`invalidate` 缺失导致外部强引用链住 BE。
  4. **静态集合持有所属 Level/Entity**。

## 「先测量后优化」清单

- [ ] 症状归类（tick / fps / 内存）
- [ ] 采样报告一份（spark 或 /debug）
- [ ] 定位 top3 Self 时间或泄漏支配路径
- [ ] 一次只改一处，重测对比
- [ ] 优化面向热点，不面向直觉；同步代码块的锁粒度仅在 profiler 显示争用时才动

## 参考与扩展点

- `mc-crash-triage` / `mc-build-mod` 工作流的性能分支；各档 `knowledge/antipatterns/`（注册/方块/实体反模式常伴随性能症状）。
- spark：<https://spark.lucko.me/docs/>；Minecraft Wiki 命令页（/debug）：<https://minecraft.wiki/w/Commands/debug>。
- JVM 参数调优（运行/运维侧，非代码优化）：mcmod 教程 [1499 Java8 优化 JVM 参数](https://www.mcmod.cn/post/1499.html)（⚠️ CMS 时代参数，仅适用老版本整合包）、[4609 整合包 JVM 参数修改](https://www.mcmod.cn/post/4609.html)、[5298 服务端 GC 选择测试](https://www.mcmod.cn/post/5298.html)——现代版本默认 G1/ZGC，旧参数照抄会启动失败。
