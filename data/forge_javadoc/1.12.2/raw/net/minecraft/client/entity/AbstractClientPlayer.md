---
title: "AbstractClientPlayer"
description: "public abstract class AbstractClientPlayer extends EntityPlayer"
package: "net/minecraft/client/entity"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/entity/AbstractClientPlayer.html"
sourceType: javadoc
---

# AbstractClientPlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.client.entity.AbstractClientPlayer

## Class signature

```java
public abstract class AbstractClientPlayer extends EntityPlayer
```

## Constructors

- `AbstractClientPlayer(World worldIn, GameProfile playerProfile)`

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
