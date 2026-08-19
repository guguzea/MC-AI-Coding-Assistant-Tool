---
name: mc-mixin
description: Minecraft Forge Mixin 注入。安全使用 @Mixin、@Inject、@At、@ModifyVariable。触发词：Mixin、@Inject、@At、mixins.json、AccessTransformer、ASM
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# Mixin 注入（Forge 1.13.2）

## 快速开始

Mixin 通过修改已编译的字节码实现运行时注入。Forge 使用 Mixin 框架。

### 1. 添加依赖（build.gradle）

```gradle
buildscript {
    repositories {
        maven { url = 'https://maven.minecraftforge.net/' }
        maven { url = 'https://repo.spongepowered.org/repository/maven-public/' }
    }
    dependencies {
        classpath 'net.minecraftforge.gradle:ForgeGradle:2.3-SNAPSHOT'
        classpath 'org.spongepowered:mixingradle:0.6-SNAPSHOT'
    }
}
apply plugin: 'org.spongepowered.mixin'
```

### 2. 配置 mixins.json

文件：`src/main/resources/{modid}.mixins.json`

```json
{
  "required": true,
  "minVersion": "0.7.11",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_8",
  "refmap": "${mod_id}.refmap.json",
  "client": ["client.SomeMixin"],
  "server": [],
  "mixins": ["common.SomeMixin"]
}
```

### 3. mods.toml 中声明

```toml
[[mixins]]
config = "${mod_id}.mixins.json"
```

## @Inject 用法

```java
@Mixin(PlayerEntity.class)
public class MixinPlayer {
    @Inject(at = @At("HEAD"), method = "attack(Lnet/minecraft/entity/Entity;)V")
    private void onAttack(CallbackInfo ci) {
        // 在原方法执行前运行
    }
}
```

## 常见错误

- ❌ Mixin 注入到构造函数
- ❌ 错误的 `@At` 参数
- ❌ 在 Mixin 中 `new` 实例

## 参考资料

- Mixin 文档：https://github.com/SpongePowered/Mixin

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Mixin 可访问注册后的内容 |
