---
title: "PlayerAdvancements"
description: "public class PlayerAdvancements extends java.lang.Object"
package: "net/minecraft/advancements"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/PlayerAdvancements.html"
sourceType: javadoc
---

# PlayerAdvancements

## Class signature

```java
public class PlayerAdvancements extends java.lang.Object
```

## Constructors

- `public PlayerAdvancements( MinecraftServer server, java.io.File p_i47422_2_, EntityPlayerMP player)`

## Methods

- `public void setPlayer( EntityPlayerMP player)`
- `public void dispose()`
- `public void reload()`
- `public void save()`
- `public boolean grantCriterion( Advancement p_192750_1_, java.lang.String p_192750_2_)`
- `public boolean revokeCriterion( Advancement p_192744_1_, java.lang.String p_192744_2_)`
- `public void flushDirty( EntityPlayerMP p_192741_1_)`
- `public void setSelectedTab( Advancement p_194220_1_)`
- `public AdvancementProgress getProgress( Advancement advancementIn)`
