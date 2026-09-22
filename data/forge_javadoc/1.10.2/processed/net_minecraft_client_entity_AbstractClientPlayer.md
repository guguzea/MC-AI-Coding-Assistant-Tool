# AbstractClientPlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.client.entity.AbstractClientPlayer

## Class signature

```java
public abstract class AbstractClientPlayer extends EntityPlayer
```

## Constructors

- `AbstractClientPlayer(World worldIn, com.mojang.authlib.GameProfile playerProfile)`

## Methods

- `static ThreadDownloadImageData getDownloadImageSkin(ResourceLocation resourceLocationIn, java.lang.String username)`
- `float getFovModifier()`
- `ResourceLocation getLocationCape()`
- `ResourceLocation getLocationElytra()`
- `ResourceLocation getLocationSkin()`
- `static ResourceLocation getLocationSkin(java.lang.String username)`
- `protected NetworkPlayerInfo getPlayerInfo()`
- `java.lang.String getSkinType()`
- `boolean hasPlayerInfo()`
- `boolean hasSkin()`
- `boolean isCreative()`
- `boolean isPlayerInfoSet()`
- `boolean isSpectator()`

## Fields

- `float rotateElytraX`
- `float rotateElytraY`
- `float rotateElytraZ`