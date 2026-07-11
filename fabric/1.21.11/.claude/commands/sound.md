# Fabric 声音系统命令参考

本文件描述 Fabric 1.21.11 平台上进行声音（Sound）系统开发时所需掌握的核心 API 和常用命令。

## 核心概念

Minecraft 的声音系统包括声音事件（Sound Event）和声音文件。声音事件是游戏内部注册的对象，声音文件是实际的音频资源。Fabric 中所有声音相关操作分为两部分：注册声音事件（服务端/客户端均可）和播放声音（通常需要区分环境）。声音文件放在 `src/main/resources/assets/{modid}/sounds/` 目录，支持 OGG 格式。

## 声音事件注册命令

### SoundEvent.of() 创建命令

注册声音事件使用 `SoundEvent.of()` 工厂方法：

```java
private static final SoundEvent MY_SOUND = 
    Registry.register(
        Registries.SOUND_EVENT,
        new Identifier(MOD_ID, "my_sound"),
        SoundEvent.of(new Identifier(MOD_ID, "my_sound"))
    );
```

声音事件的 ID 必须与声音文件的路径对应。例如，声音事件 `examplemod:my_sound` 对应声音文件 `assets/examplemod/sounds/my_sound.ogg`。

### SoundEntry 定义命令

对于需要多个变体的声音（如脚步声有多个变体），创建 `SoundEntry`：

```java
SoundEntry mySound = new SoundEntry(
    new Identifier(MOD_ID, "my_sound_1"),
    new Identifier(MOD_ID, "my_sound_2"),
    new Identifier(MOD_ID, "my_sound_3")
);
```

播放时会随机选择一个变体。

## 声音文件配置命令

### sounds.json 配置命令

`sounds.json` 文件定义声音事件的属性和变体：

```json
{
  "examplemod:my_sound": {
    "sounds": [
      "examplemod:my_sound",
      {
        "name": "examplemod:my_sound_alt",
        "volume": 0.8,
        "pitch": 1.2
      }
    ],
    "subtitle": "subtitle.examplemod.my_sound"
  }
}
```

`sounds` 数组可以包含字符串（简单变体）或对象（带音量、音高配置）。`subtitle` 定义翻译键，用于在聊天栏显示字幕。

### sounds 目录结构命令

声音文件放置在 `src/main/resources/assets/{modid}/sounds/` 目录：

```
sounds/
├── my_sound.ogg           # 直接引用
├── my_sound_alt.ogg       # 变体
└── subfolder/
    └── another_sound.ogg  # 子文件夹，需要完整路径
```

文件引用时使用 `examplemod:subfolder/another_sound` 格式。

## 声音播放命令

### World.playSound() 播放命令

播放声音的基本命令：

```java
// 在世界中播放声音
world.playSound(
    player,              // 参考玩家（用于音量衰减计算）
    MY_SOUND,            // 声音事件
    SoundCategory.MASTER, // 声音类别（影响音量滑块）
    1.0f,                // 音量
    1.0f                 // 音高
);
```

`SoundCategory` 包括：`MASTER`（主音量）、`MUSIC`（音乐）、`RECORDS`（唱片）、`WEATHER`（天气）、`BLOCKS`（方块）、`HOSTILE`（敌对生物）、`NEUTRAL`（中立生物）、`PLAYERS`（玩家）、`AMBIENT`（环境）、`VOICE`（语音）。

### PlayerEntity.playSound() 命令

向特定玩家播放声音：

```java
player.playSound(
    MY_SOUND,
    1.0f,  // 音量
    1.0f   // 音高
);
```

此方法不会衰减（不考虑位置），适用于 UI 声音或通知。

### ServerPlayerEntity.playSound() 命令

服务端玩家播放带衰减的声音：

```java
player.playSound(
    MY_SOUND,
    SoundCategory.PLAYERS,
    volume,
    pitch,
    false  // useDistance 在 1.20+ 已移除
);
```

## 客户端声音命令

### ClientPlaySound 命令

客户端播放声音（绕过服务端）：

```java
// 在客户端代码中
MinecraftClient.getInstance().getSoundManager().play(
    new LocatedSoundInstance(
        MY_SOUND.getId(),
        SoundCategory.MASTER,
        1.0f, 1.0f,
        0,    // x
        0,    // y
        0,    // z
        SoundInstance.AttenuationType.LINEAR,
        16.0f // 衰减距离
    )
);
```

通常使用服务端-客户端网络同步来播放声音，而不是直接在客户端播放。

## 声音衰减命令

### SoundInstance 配置命令

声音衰减控制声音如何随距离减弱：

```java
// 线性衰减（默认）
LocatedSoundInstance instance = new LocatedSoundInstance(
    soundId, category, volume, pitch,
    x, y, z,
    SoundInstance.AttenuationType.LINEAR,
    attenuationDistance
);

// 无衰减
new PermanentSoundInstance(soundId, category, volume, pitch);

// 区块衰减
new LocatedSoundInstance(..., SoundInstance.AttenuationType.NONE, 0);
```

### 衰减距离命令

常见衰减距离：`16`（近距离，如脚步声）、`64`（中等距离）、`256`（远距离，如爆炸）。

## 背景音乐命令

### MusicDisc 命令

创建音乐唱片物品：

```java
private static final RegistrySupplier<Item> MUSIC_DISC = 
    Registry.register(
        Registries.ITEM,
        new Identifier(MOD_ID, "music_disc"),
        new MusicDiscItem(
            0,  // 比较器输出信号强度
            MY_SOUND,  // 播放的声音
            new Item.Settings()
                .maxCount(1)
                .group(ItemGroup.MISC)
                .rarity(Rarity.RARE)
        )
    );
```

## 声音类别命令

### SoundCategory 配置命令

声音类别与游戏设置的各个音量滑块对应：

```java
SoundCategory category = SoundCategory.fromId(id);
// id: 0=master, 1=music, 2=records, 3=weather, 
//     4=blocks, 5=hostile, 6=neutral, 7=players, 8=ambient
```

Mod 添加自定义声音类别需要修改 sounds.json 中的 `sounds` 字段，播放时仍然使用现有类别之一。

## 状态相关声音命令

### Entity.playSound() 命令

实体播放声音（与位置绑定）：

```java
entity.playSound(MY_SOUND, volume, pitch);
// 声音从实体的位置发出
```

### Block.playSound() 命令

方块播放声音：

```java
BlockState state = world.getBlockState(pos);
world.playSound(
    player,
    pos,
    state.getSoundGroup().getHitSound(),  // 挖掘声音
    SoundCategory.BLOCKS,
    1.0f, 1.0f
);
```

## 声音网络同步命令

### 服务端触发声音命令

与服务端触发粒子类似，声音需要网络同步：

```java
// 服务端发送网络包
ServerPlayNetworking.send(player, SOUND_PACKET_ID,
    PacketByteBuf.createUnpooled()
        .writeIdentifier(MY_SOUND.getId())
        .writeFloat(volume)
        .writeFloat(pitch));

// 客户端接收并播放（在 ClientModInitializer 中）
ClientPlayNetworking.registerGlobalReceiver(SOUND_PACKET_ID, (payload, context) -> {
    Identifier soundId = buf.readIdentifier();
    float volume = buf.readFloat();
    float pitch = buf.readFloat();
    // 回调已在正确线程执行
    SoundEvent sound = SoundEvent.of(soundId);
    MinecraftClient.getInstance().player.playSound(sound, volume, pitch);
});
```

## 音效参数命令

### 音量命令

音量是相对于最大音量的倍数：`1.0f` 表示全音量，`0.5f` 表示半音量。音量也影响声音衰减的起始距离，音量越大可听距离越远。

### 音高命令

音高是播放速度的倍数：`1.0f` 表示正常速度，`0.5f` 表示半速（更低沉），`2.0f` 表示双倍速（更高亢）。有效范围通常 `0.5f` 到 `2.0f`。

## 语音合成命令

### TextToSpeech 集成命令

Fabric 支持语音合成（需要系统 TTS 支持）。通过 Mixin 注入自定义语音合成逻辑。此功能主要用于辅助功能，常规模组开发很少使用。
