---
name: mc-cloth-config
description: Fabric Cloth Config 配置系统。ConfigBuilder、ConfigCategory、ConfigEntryBuilder。触发词：Cloth Config、ConfigBuilder、ConfigEntryBuilder、ConfigScreen
platform: fabric
version: "1.20.1"
dependencies: []
mappings: yarn
---
<!-- cloth-version-inject v=1.20.1 coord=11.1.136 state=active textApi=literal -->

# Cloth Config（Fabric 1.20.1）

## 概述

Cloth Config 是 Fabric 侧广泛使用的**第三方**配置库（不是 Fabric 官方组件，也没有「官方推荐」这一说），提供类型安全的配置系统与配置 GUI。

本包未把它的 API 摘要入库（`$MC_SKILL_CACHE/loader-api-summaries` 里没有 fabric-cloth-config 条目）⇒ 下面所有类名 / 方法名都属**未核实**，动手前须让用户用自己的 cloth-config jar 跑一次 `ingest_loader_api` 入库，再逐签名回填；依赖坐标与仓库行则是实取上游核实过的（见「添加依赖」下的依据句）。

## 添加依赖

```groovy
// build.gradle
repositories {
    // Cloth 只发布在 https://maven.shedaniel.me/ —— 少这一段必然 Could not resolve
    maven { url "https://maven.shedaniel.me/" }
}

dependencies {
    modApi("me.shedaniel.cloth:cloth-config-fabric:11.1.136") {
        exclude group: "net.fabricmc.fabric-api"
    }
}
```


> 本档取 11.1.136：pom 里 fabric-api 依赖为 0.83.0+1.20（旧稿写的 11.0.106 上游不存在）。Cloth 是第三方库，其 **API 面**（ConfigBuilder / ConfigEntryBuilder 等签名）本包未走 `ingest_loader_api` 入库 ⇒ 写代码前仍须自备 jar 入库逐签名核对，版本号已核实不代表 API 面已核实。

> 版本怎么定（一手判据，2026-09-14 实取 `maven.shedaniel.me/.../cloth-config-fabric/maven-metadata.xml`，126 条）：
> cloth 的版本号形态**从来不带 `+<MC>` 后缀**；MC 线绑在「该版 pom 里 fabric-api 依赖的后缀」上。对照：
> `4.x → +1.16`｜`5.x → +1.17`｜`6.x → +1.18`｜`7.0.x → +1.19`｜`8.x → +1.19.1`｜`9.x → +1.19.3`｜`10.0.x → +1.19.4`｜
> `11.x → +1.20`｜`12.x → +1.20.2`｜`13.0.x → +1.20.4`；1.20.5 起改由 jar 内 `fabric.mod.json` 的 `depends.minecraft` 判定：
> `14.0.x → >=1.20.5`｜`15.0.x → >=1.21`｜`16.0.x → >=1.21.2`｜`17.0.x / 18.0.x → >=1.21.4`｜`19.0.x → >=1.21.6`｜`20.0.x / 21.11.x → >=1.21.9`｜`26.1.x → >=26.1`｜`26.2.x → >=26.2`。
> 换 MC 线时必须按上表重新核，不许把别档的版本号抄过来。

## 基本配置

```java
// 1. 创建配置选项类
public class ModConfig implements ConfigSerializable {
    @ConfigEntry.Gui.Excluded
    public ConfigBuilder builder = ConfigBuilder.create()
        .title(Text.literal("My Mod Config"))
        .category(ConfigCategory.createBuilder()
            .name(Text.literal("General"))
            .option(ConfigEntry.BoolOption.createBuilder(true)
                .name(Text.literal("Enable Feature"))
                .tooltip(Text.literal("Enable or disable the feature"))
                .build())
            .option(ConfigEntry.IntSliderOption.createBuilder(10, 1, 100)
                .name(Text.literal("Value"))
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

        builder.addLabel(Text.literal("My Configuration"));
        builder.addEntry(EntryBuilder.startBooleanToggle(
                Text.translatable("config.my_mod.enable_feature"))
            .setDefaultValue(true)
            .setSaveConsumer(v -> enableFeature = v)
            .build());

        builder.addEntry(EntryBuilder.startIntSlider(
                Text.translatable("config.my_mod.value"), 10, 100)
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
