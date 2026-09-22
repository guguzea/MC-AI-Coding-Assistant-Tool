# AbstractClientPlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.client.entity.AbstractClientPlayer

## Class signature

```java
public abstract class AbstractClientPlayer extends EntityPlayer
```

## Methods

- `static ThreadDownloadImageData getDownloadImageSkin(ResourceLocation resourceLocationIn, java.lang.String username)`
- `float getFovModifier()`
- `ResourceLocation getLocationCape()`
- `ResourceLocation getLocationSkin()` — Returns true if the player instance has an associated skin.
- `static ResourceLocation getLocationSkin(java.lang.String username)` — Returns true if the username has an associated skin.
- `protected NetworkPlayerInfo getPlayerInfo()`
- `java.lang.String getSkinType()`
- `boolean hasPlayerInfo()` — Checks if this instance of AbstractClientPlayer has any associated player data.
- `boolean hasSkin()` — Returns true if the player has an associated skin.
- `boolean isSpectator()` — Returns true if the player is in spectator mode.

## Fields

- `AbstractClientPlayer`