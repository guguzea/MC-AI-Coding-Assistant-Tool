---
name: mc-sound
description: Fabric 声音系统。SoundEvent、SoundEvents、SoundCategory。触发词：声音、Sound、SoundEvent
platform: fabric
version: "1.18.2"
dependencies: []
mappings: yarn
---

# 声音系统（Fabric 1.18.2）

## 快速开始

```java
// 1. 创建 SoundEvent
private static final RegistrySupplier<SoundEvent> MY_SOUND = Registry.register(
    Registries.SOUND_EVENT,
    new Identifier(MOD_ID, "my_sound"),
    SoundEvent.of(new Identifier(MOD_ID, "my_sound"))
);

// 2. 播放声音
player.playSound(MY_SOUND.get(), 1.0f, 1.0f);
```

## Decision: 选择声音用途

```
IF 在世界中播放声音
  → World.playSound()

IF 在 GUI 中播放声音
  → ClientPlayerEntity.playSound()

IF 循环播放
  → 使用 SoundInstance
```

## 常见错误

- ❌忘记在 resources 中添加声音文件 — 声音文件不存在

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 声音事件通过 Registry.register() 注册 |
| `mc-item` | 物品可以播放声音 |
| `mc-entity` | 实体可以播放声音 |
