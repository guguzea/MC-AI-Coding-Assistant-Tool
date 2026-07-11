---
name: mc-cloth-config
description: Fabric Cloth Config 配置系统。ConfigBuilder、ConfigCategory、ConfigEntryBuilder。触发词：Cloth Config、ConfigBuilder、ConfigEntryBuilder、ConfigScreen
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# Cloth Config（Fabric 1.17.1）

## 概述

Cloth Config 是 Fabric 推荐的配置库，提供类型安全的配置系统和 GUI。

## 添加依赖

```groovy
// build.gradle
dependencies {
    modApi("me.shedaniel.cloth:cloth-config-fabric:6.0.46+1.17") {
        exclude group: "net.fabricmc.fabric-api"
    }
}
```

## 基本配置

```java
// 1. 创建配置选项类
public class ModConfig {
    private final ConfigBuilder builder;

    public ModConfig() {
        builder = ConfigBuilder.create()
            .title(Text.literal("My Mod Config"))
            .setDefaultTitle("My Mod Config")
            .setSavingRunnable(() -> {
                // 保存配置
            });

        ConfigCategory general = builder.getOrCreateCategory("general");

        general.addEntry(ConfigEntryBuilder.create()
            .startBooleanToggle(Text.literal("Enable Feature"), true)
            .setSaveConsumer(value -> enableFeature = value)
            .build()
        );

        general.addEntry(ConfigEntryBuilder.create()
            .startIntSlider(Text.literal("Value"), 10, 1, 100)
            .setSaveConsumer(value -> this.value = value)
            .build()
        );
    }

    public boolean enableFeature = true;
    public int value = 10;

    public ConfigBuilder getBuilder() {
        return builder;
    }
}
```

## 配置屏幕入口

```java
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        ClothConfig.initialize();
        // 注册配置屏幕
        ClothConfig.getOrCreateModConfig("examplemod",
            () -> new ModConfig().getBuilder().setParentScreen(null).build());
    }
}
```

## 常见错误

- ❌忘记 `exclude group: "net.fabricmc.fabric-api"` — 依赖冲突
- ❌在服务端创建 ConfigScreen — ConfigScreen 是客户端的
- ❌忘记在 `fabric.mod.json` 中声明 cloth-config 依赖

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Cloth Config 提供配置 GUI |
| `mc-registry` | 配置通过 Registry 持久化 |
