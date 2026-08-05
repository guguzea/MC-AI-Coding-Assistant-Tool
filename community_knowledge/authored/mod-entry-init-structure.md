---
id: authored/mod-entry-init-structure
title: 主类瘦身与 init 注册拆分
tags: [engineering, structure, deferredregister, eventbus, forge, package]
summary: MDK 模板主类六块拆解；主类只挂总线；init/client/event/block 分包；ModEventBus 挂载区约定。
mcHint: 1.20.1+
sourceKind: authored
---

# 主类瘦身与 init 注册拆分

自写短文。工程化增量；API 以官方文档为准。

## 为什么要拆

Forge MDK / IDEA Minecraft 生成器给出的主类通常是**功能演示**：DeferredRegister、示例方块物品、创造页签、Forge 事件、客户端 setup、Config 全挤在一起。短期能跑；模组变大后会出现：

- 主类上千行，找不到入口  
- 注册与玩法逻辑耦合，难测难复用  
- 客户端类误进共用路径 → 专用服崩溃  

目标：主类变成 **启动调度中心**，不是业务仓库。

## 模板主类常见六块 → 去向

| 模板内容 | 处理 |
|----------|------|
| `@Mod`、MODID、Logger | **保留**在主类 |
| `DeferredRegister` 字段与 `register(bus)` | 迁到 `init` / `registry`：`ModBlocks`、`ModItems`、`ModCreativeTabs`… |
| 示例方块/物品/页签实例 | 删除或迁到真实内容类 |
| `MinecraftForge.EVENT_BUS.register(this)` + `@SubscribeEvent` | 独立 `event` 类或 `@EventBusSubscriber` |
| 内部类 `ClientModEvents` / 仅客户端逻辑 | `client` 包 + `Dist.CLIENT` |
| 示例 `Config` + `registerConfig` | 不需要就删；需要时再按 COMMON/CLIENT/SERVER 引入 |

## 推荐包结构（示意）

```
com.example.mod/
  ExampleMod.java          # 入口
  init/                    # DeferredRegister 入口
    ModBlocks.java
    ModItems.java
    ModBlockEntities.java
    ModMenuTypes.java
    ModCreativeTabs.java
  block/…                  # 方块行为
  blockentity/…
  client/                  # Screen、渲染、仅客户端
  event/                   # 可选：游戏内监听
```

机器类内容可再分 `block/machine`，与普通方块区分职责。

## 主类最小形态

```java
@Mod(ExampleMod.MODID)
public class ExampleMod {
    public static final String MODID = "examplemod";

    public ExampleMod() {
        IEventBus modBus = FMLJavaModLoadingContext.get().getModEventBus();

        // region ModEventBus — 所有 DeferredRegister / MOD 总线监听挂这里
        ModBlocks.register(modBus);
        ModItems.register(modBus);
        ModCreativeTabs.register(modBus);
        ModBlockEntities.register(modBus);
        ModMenuTypes.register(modBus);
        modBus.addListener(this::commonSetup);
        // endregion

        // 游戏总线（若仍用实例订阅）
        // MinecraftForge.EVENT_BUS.register(new ModEvents());
    }

    private void commonSetup(final FMLCommonSetupEvent event) {
        // 可选：enqueueWork 做非注册表初始化
    }
}
```

`//region ModEventBus` 只是可读性约定：后人一眼知道「配电箱」在哪。

## 两类事件总线（勿混）

| 总线 | 典型内容 |
|------|----------|
| Mod Event Bus（`FMLJavaModLoadingContext.get().getModEventBus()`） | DeferredRegister、`FMLCommonSetupEvent`、`BuildCreativeModeTabContentsEvent`、客户端 `FMLClientSetupEvent` |
| Forge 游戏总线（`MinecraftForge.EVENT_BUS`） | 游玩中事件：伤害、tick、右键世界等 |

注册表相关必须走 Mod 总线；把 `DeferredRegister.register` 漏挂会导致内容「写了但不存在」。

## 自检

- 打开主类是否仍能一眼看完？  
- 新增方块是否只改 `init` + 行为类，而不改主类逻辑？  
- `runServer` 能否启动（无 Screen 等客户端类被服务端加载）？

## 不清楚时

- 注册 helper：`authored/register-helpers`  
- 工程化外链（禁转载，仅浏览）：https://www.mcmod.cn/post/6071.html  
- 维护向许可原文：https://www.mcmod.cn/post/3993.html
