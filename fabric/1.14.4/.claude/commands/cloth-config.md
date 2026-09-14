---
name: mc-cloth-config
description: Fabric Cloth Config 配置系统。ConfigBuilder、ConfigCategory、ConfigEntryBuilder。触发词：Cloth Config、ConfigBuilder、ConfigEntryBuilder、ConfigScreen
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---

# Cloth Config（Fabric 1.14.4）

## 概述

Cloth Config 是 Fabric 侧广泛使用的**第三方**配置库（不是 Fabric 官方组件，也没有「官方推荐」这一说），提供类型安全的配置系统与配置 GUI。

本包未把它的 API 摘要入库（`$MC_SKILL_CACHE/loader-api-summaries` 里没有 fabric-cloth-config 条目）⇒ 下面所有类名 / 方法名都属**未核实**，动手前须让用户用自己的 cloth-config jar 跑一次 `ingest_loader_api` 入库，再逐签名回填；依赖坐标与仓库行则是实取上游核实过的（见「添加依赖」下的依据句）。

## 添加依赖

```groovy
// build.gradle
dependencies {
    modApi "me.shedaniel.cloth:cloth-config-fabric:TODO(未核实)" { // 第三方库：maven.shedaniel.me cloth-config-fabric/maven-metadata.xml（2026-09-14 读，126 版，最低 4.10.11，无 11.0.106，无 1.14.4 档）未取证；Cloth 非加载器 API，方法签名须由用户自备 jar 走 ingest_loader_api 核实
        exclude group: "net.fabricmc.fabric-api"
    }
}
```

## 基本配置

```java
// 1. 创建配置选项类
public class ModConfig implements ConfigSerializable {
    @ConfigEntry.Gui.Excluded
    public ConfigBuilder builder = ConfigBuilder.create()
        .title(new LiteralText("My Mod Config"))
        .category(ConfigCategory.createBuilder()
            .name(new LiteralText("General"))
            .option(ConfigEntry.BoolOption.createBuilder(true)
                .name(new LiteralText("Enable Feature"))
                .tooltip(new LiteralText("Enable or disable the feature"))
                .build())
            .option(ConfigEntry.IntSliderOption.createBuilder(10, 1, 100)
                .name(new LiteralText("Value"))
                .build())
            .build())
        .save(() -> {
            // 保存配置时的回调
        });

    public boolean enableFeature = true;
    public int value = 10;

    @Override
    public ConfigSerializer<?> getSerializer() {
        return builder.getSerializer();
    }
}
```

## 使用 ConfigBuilder

```java
public class MyConfigScreen extends ConfigScreen {
    public MyConfigScreen(@Nullable Screen parent) {
        super(parent, (me.shedaniel.clothconfig2.gui.ClothConfigScreenBuilder) null);
    }

    @Override
    public void build(Screen parent, Consumer<AbstractConfigListEntry> consumer,
                      ClothConfigBuilder builder) {
        builder.setGlobalErrorSupplier(...);
        builder.setSavingRunnable(() -> {
            // 保存配置
        });

        builder.addLabel(new LiteralText("My Configuration"));
        builder.addEntry(EntryBuilder.startBooleanToggle(
                new TranslatableText("config.my_mod.enable_feature"))
            .setDefaultValue(true)
            .setSaveConsumer(v -> enableFeature = v)
            .build());

        builder.addEntry(EntryBuilder.startIntSlider(
                new TranslatableText("config.my_mod.value"), 10, 100)
            .setDefaultValue(50)
            .setSaveConsumer(v -> value = v)
            .build());
    }
}
```

## 配置屏幕入口

```java
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // 注册配置屏幕
        ClothConfigAddon.setNewDefaultValue(
            new Identifier(MOD_ID, "config"), new ModConfig()
        );
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
