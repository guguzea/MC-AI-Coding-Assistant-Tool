---
description: 08 — 物理端（NeoForge 26.3）
---

# 08 — 物理端（NeoForge 26.3）

> 证据类型：官方 MDK 模板源码（`MDK-26.3-ModDevGradle@f31f90e7` 的 `ExampleMod.java` / `ExampleModClient.java`）。

## 客户端专属类（`ExampleModClient.java:14-16`）

```java
@Mod(value = ExampleMod.MODID, dist = Dist.CLIENT)
@EventBusSubscriber(modid = ExampleMod.MODID, value = Dist.CLIENT)
public class ExampleModClient {
    public ExampleModClient(ModContainer container) { }
}
```

MDK 注释原文（`:13`）：「This class will not load on dedicated servers. Accessing client side code from here is safe.」

- 构造器只收 `ModContainer`（可以不要参数）
- 类里 `@SubscribeEvent` 方法**必须 static**（`:26` 是 `static void onClientSetup`）

## 客户端 setup

```java
@SubscribeEvent
static void onClientSetup(FMLClientSetupEvent event) {
    ExampleMod.LOGGER.info("MINECRAFT NAME >> {}", Minecraft.getInstance().getUser().getName());
}
```

- `FMLClientSetupEvent` 在 `net.neoforged.fml.event.lifecycle`
- `Minecraft.getInstance()` 只能在客户端类里出现

## 配置屏（`:22`）

```java
container.registerExtensionPoint(IConfigScreenFactory.class, ConfigurationScreen::new);
```

- `net.neoforged.neoforge.client.gui.IConfigScreenFactory` / `ConfigurationScreen`
- 作用：Mods 界面里给本 mod 生成配置屏；**不是**自定义 Screen

## 服务端类

MDK 的 `ExampleMod.java` 用 `@Mod(MODID)`（不带 `dist`）⇒ 两端都加载。服务端事件（`ServerStartingEvent`）在**游戏总线**上，见 05。

## 禁止

- 在 `@Mod`（无 `dist`）的类里 import `net.minecraft.client.*`
- `@EventBusSubscriber` 用实例方法
- 把 `IConfigScreenFactory` 当自定义 Screen 的注册入口
