---
title: "AbstractClientPlayer"
description: "Returns true if the player instance has an associated skin."
package: "net/minecraft/client/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/entity/AbstractClientPlayer.html"
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
- `public boolean hasPlayerInfo()`
- `protected NetworkPlayerInfo getPlayerInfo()`
- `public boolean hasSkin()`
- `public ResourceLocation getLocationSkin()`
- `public ResourceLocation getLocationCape()`
- `public static ThreadDownloadImageData getDownloadImageSkin( ResourceLocation resourceLocationIn, java.lang.String username)`
- `public static ResourceLocation getLocationSkin(java.lang.String username)`
- `public java.lang.String getSkinType()`
- `public float getFovModifier()`

## Description

Returns true if the player instance has an associated skin.
