---
id: mcmod-3993/mixin-basics
title: Mixin 实务要点（社区）
tags: [mixin, inject, redirect, bytecode]
mcHint: version-agnostic
---

# Mixin 实务要点

> 提炼自社区教程 Mixin 篇；生产环境请配合官方 Mixin 文档与本仓库 `mc-mixin` skill。

## 要点

1. Mixin 用于改写原版 / 其他模组行为，需在 `mixins.json` 中声明。
2. `@Inject` / `@Redirect` 的 `method`、`at`/`target` 必须与目标方法描述符一致。
3. 可用字节码视角理解 `INVOKEVIRTUAL owner.method(desc)`，再写成 Mixin target。
4. `<init>` = 构造方法；`<clinit>` = 静态初始化块。
5. IDE 插件（如 Mixin Supporter）可辅助补全注解参数，但不能替代验证与测试。

## 风险

错误注入会导致启动失败或难查崩溃；优先用事件 / API，Mixin 作最后手段。
