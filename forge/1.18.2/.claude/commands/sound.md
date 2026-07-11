# 声音相关（Forge 1.18.2）

## 注册 SoundEvent

```java
public static final DeferredRegister<SoundEvent> SOUNDS =
    DeferredRegister.create(ForgeRegistries.SOUNDEVENTS, MOD_ID);

public static final RegistryObject<SoundEvent> MY_SOUND =
    SOUNDS.register("my_sound",
        () -> SoundEvent.createVariableRangeEvent(new ResourceLocation(MOD_ID, "my_sound"))
    );
```

## 播放声音

```java
level.playSound(player, x, y, z, MY_SOUND.get(), SoundSource.BLOCKS, 1.0f, 1.0f);
```

## 常见错误

- ❌ 废弃的 `new SoundEvent(id)` 构造函数
- ❌ `sounds.json` 中 `sounds` 写成对象而非数组

## 参考资料

参见 `02-block.mdc`
