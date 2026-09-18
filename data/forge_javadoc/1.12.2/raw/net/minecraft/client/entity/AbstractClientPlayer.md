---
title: "AbstractClientPlayer"
description: "public abstract class AbstractClientPlayer extends EntityPlayer"
package: "net/minecraft/client/entity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/entity/AbstractClientPlayer.html"
sourceType: javadoc
---

# AbstractClientPlayer

## Class signature

```java
public abstract class AbstractClientPlayer extends EntityPlayer
```

## Constructors

- `public AbstractClientPlayer( World worldIn, GameProfile playerProfile)`

## Methods

- `public boolean isSpectator()`
- `public boolean isCreative()`
- `public boolean hasPlayerInfo()`
- `protected NetworkPlayerInfo getPlayerInfo()`
- `public boolean hasSkin()`
- `public ResourceLocation getLocationSkin()`
- `public ResourceLocation getLocationCape()`
- `public boolean isPlayerInfoSet()`
- `public ResourceLocation getLocationElytra()`
- `public static ThreadDownloadImageData getDownloadImageSkin( ResourceLocation resourceLocationIn, java.lang.String username)`
- `public static ResourceLocation getLocationSkin(java.lang.String username)`
- `public java.lang.String getSkinType()`
- `public float getFovModifier()`
