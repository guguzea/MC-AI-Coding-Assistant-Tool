---
title: "FakePlayer"
description: "Adds a value to a statistic field."
package: "net/minecraftforge/common/util"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/util/FakePlayer.html"
sourceType: javadoc
---

# FakePlayer

## Class signature

```java
public class FakePlayer extends EntityPlayerMP
```

## Constructors

- `public FakePlayer( WorldServer world, GameProfile name)`

## Methods

- `public Vec3 getPositionVector()`
- `public boolean canCommandSenderUseCommand(int i, java.lang.String s)`
- `public void addChatComponentMessage( IChatComponent chatmessagecomponent)`
- `public void addStat( StatBase par1StatBase, int par2)`
- `public void openGui(java.lang.Object mod, int modGuiId, World world, int x, int y, int z)`
- `public boolean isEntityInvulnerable( DamageSource source)`
- `public boolean canAttackPlayer( EntityPlayer player)`
- `public void onDeath( DamageSource source)`
- `public void onUpdate()`
- `public void travelToDimension(int dim)`
- `public void handleClientSettings( C15PacketClientSettings pkt)`

## Description

Adds a value to a statistic field.
