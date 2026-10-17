---
name: mc-cloth-config
description: Fabric Cloth Config 配置系统。ConfigBuilder、ConfigCategory、ConfigEntryBuilder。触发词：Cloth Config、ConfigBuilder、ConfigEntryBuilder、ConfigScreen
platform: fabric
version: "1.16.5"
dependencies: []
mappings: yarn
---
<!-- external-apis: cloth-config, jdk -->

<!-- cloth-version-inject v=1.16.5 coord=4.14.64 state=active textApi=constructor -->

# Cloth Config（Fabric 1.16.5）

## 概述

Cloth Config 是 Fabric 侧广泛使用的**第三方**配置库（不是 Fabric 官方组件，也没有「官方推荐」这一说），提供类型安全的配置系统与配置 GUI。

本件下列类名/方法名已按本档构件 `cloth-config-fabric-4.14.64.jar` 逐条 `javap` 核实；它仍不属于 loader API，升级 cloth 版本后要按新 jar 重核。

## 添加依赖

```groovy
// build.gradle
repositories {
    // Cloth 只发布在 https://maven.shedaniel.me/ —— 少这一段必然 Could not resolve
    maven { url "https://maven.shedaniel.me/" }
}

dependencies {
    modApi("me.shedaniel.cloth:cloth-config-fabric:4.14.64") {
        exclude group: "net.fabricmc.fabric-api"
    }
}
```


> 本档取 4.14.64：pom 里 fabric-api 依赖为 0.30.0+1.16。API 面已按该 jar javap 核实到本件所列范围（见下）。

> 版本怎么定（一手判据，实取 `maven.shedaniel.me/.../cloth-config-fabric/maven-metadata.xml`，126 条）：
> cloth 的版本号形态**从来不带 `+<MC>` 后缀**；MC 线绑在「该版 pom 里 fabric-api 依赖的后缀」上。对照：
> `4.x → +1.16`｜`5.x → +1.17`｜`6.x → +1.18`｜`7.0.x → +1.19`｜`8.x → +1.19.1`｜`9.x → +1.19.3`｜`10.0.x → +1.19.4`｜
> `11.x → +1.20`｜`12.x → +1.20.2`｜`13.0.x → +1.20.4`；1.20.5 起改由 jar 内 `fabric.mod.json` 的 `depends.minecraft` 判定：
> `14.0.x → >=1.20.5`｜`15.0.x → >=1.21`｜`16.0.x → >=1.21.2`｜`17.0.x / 18.0.x → >=1.21.4`｜`19.0.x → >=1.21.6`｜`20.0.x / 21.11.x → >=1.21.9`｜`26.1.x → >=26.1`｜`26.2.x → >=26.2`。
> 换 MC 线时必须按上表重新核，不许把别档的版本号抄过来。

## 路线 A：注解 + AutoConfig（推荐，代码最少）

```java
import me.shedaniel.autoconfig.AutoConfig;
import me.shedaniel.autoconfig.ConfigData;
import me.shedaniel.autoconfig.ConfigHolder;
import me.shedaniel.autoconfig.annotation.Config;
import me.shedaniel.autoconfig.serializer.GsonConfigSerializer;

@Config(name = "examplemod")               // 注解方法名就是 name()
public class ModConfig implements ConfigData {
    public boolean enableFeature = true;   // 本件自造示例字段，没有任何 MC 符号出处

    public int value = 10;
}

// ModInitializer#onInitialize()
public static final ConfigHolder<ModConfig> HOLDER =
        AutoConfig.register(ModConfig.class, GsonConfigSerializer::new);
```

- `AutoConfig.register(Class<T extends ConfigData>, ConfigSerializer.Factory<T>)` → `ConfigHolder<T>`；`ConfigHolder` 有 `getConfig()` / `save()` / `load()` / `setConfig(T)` / `resetToDefault()`（javap @ 本档 jar）。
- 配置屏幕：`AutoConfig.getConfigScreen(ModConfig.class, parent).get()`（返回 `Supplier<Screen>`）。

## 路线 B：手动 ConfigBuilder（自定义 GUI）

```java
import me.shedaniel.clothconfig2.api.ConfigBuilder;
import me.shedaniel.clothconfig2.api.ConfigCategory;
import me.shedaniel.clothconfig2.api.ConfigEntryBuilder;
import net.minecraft.client.gui.screen.Screen;
import net.minecraft.text.LiteralText;

public static Screen buildScreen(Screen parent, ModConfig config) {
    ConfigBuilder builder = ConfigBuilder.create()
            .setParentScreen(parent)
            .setTitle(new LiteralText("My Mod Config"));

    ConfigCategory general = builder.getOrCreateCategory(new LiteralText("General"));
    ConfigEntryBuilder entries = builder.entryBuilder();

    general.addEntry(entries.startBooleanToggle(new LiteralText("Enable Feature"), config.enableFeature) // enableFeature 本件自造示例字段，没有任何 MC 符号出处
            .setDefaultValue(true)
            .setSaveConsumer(v -> config.enableFeature = v) // enableFeature 同上：本件自造示例字段，没有任何 MC 符号出处
            .build());

    general.addEntry(entries.startIntSlider(new LiteralText("Value"), config.value, 1, 100)
            .setDefaultValue(10)
            .setSaveConsumer(v -> config.value = v)
            .build());

    builder.setSavingRunnable(() -> { /* 写盘 */ });
    return builder.build();
}
```

已核实的签名（`javap` @ `cloth-config-fabric-4.14.64.jar`）：

- `ConfigBuilder.create()`；实例方法 `setParentScreen(Screen)` / `setTitle(Text)` / `getOrCreateCategory(Text)` / `entryBuilder()` / `setSavingRunnable(Runnable)` / `build() → Screen`。
- `ConfigCategory#addEntry(AbstractConfigListEntry)`（不是 `.option(...)` / `.createBuilder()` —— 这两个名字在本档 jar 里 0 命中）。
- `ConfigEntryBuilder.create()`；`startBooleanToggle(Text, boolean)` / `startIntSlider(Text, int, int, int)`；builder 侧 `setDefaultValue(...)` / `setSaveConsumer(Consumer<...>)` / `build()`。

## 常见错误

- ❌忘记 `exclude group: "net.fabricmc.fabric-api"` — 依赖冲突
- ❌在服务端创建 ConfigScreen — ConfigScreen 是客户端的
- ❌忘记在 `fabric.mod.json` 中声明 cloth-config 依赖

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Cloth Config 提供配置 GUI |
| `mc-registry` | 配置通过 Registry 持久化 |
