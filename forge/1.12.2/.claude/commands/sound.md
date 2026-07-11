# 声音开发（Forge 1.12.2）

## 快速开始

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModSounds {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<SoundEvent> event) {
        event.getRegistry().register(
            new SoundEvent(new ResourceLocation(MOD_ID, "my_sound"))
                .setRegistryName(MOD_ID, "my_sound")
        );
    }
}
```

## sounds.json

```json
{
  "my_sound": {
    "category": "master",
    "sounds": ["examplemod:my_sound_file"]
  }
}
```

## 播放声音

```java
// 服务端播放给附近所有玩家
world.playSound(null, x, y, z, ModSounds.my_sound, SoundCategory.BLOCKS, 1.0f, 1.0f);
```

## SoundCategory

| 值 | 用途 |
|----|------|
| MASTER | 主音量 |
| MUSIC | 背景音乐 |
| BLOCKS | 方块交互 |
| HOSTILE | 敌对生物 |

## 常见错误

- ❌ `sounds.json` 中 sounds 写成对象而非数组

## 参考资料

- 详细示例：参见 `02-block.mdc`
