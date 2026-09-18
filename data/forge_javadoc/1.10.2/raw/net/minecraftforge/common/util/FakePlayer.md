---
title: "FakePlayer"
description: "Opens a GUI with this player, uses FML's IGuiHandler system."
package: "net/minecraftforge/common/util"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/util/FakePlayer.html"
sourceType: javadoc
---

# FakePlayer

## Class signature

```java
public class FakePlayer extends EntityPlayerMP
```

## Constructors

- `public FakePlayer( WorldServer world, com.mojang.authlib.GameProfile name)`

## Methods

- `public Vec3d getPositionVector()`
- `public boolean canCommandSenderUseCommand(int i, java.lang.String s)`
- `public void addChatComponentMessage( ITextComponent chatmessagecomponent)`
- `public void addStat( StatBase par1StatBase, int par2)`
- `public void openGui(java.lang.Object mod, int modGuiId, World world, int x, int y, int z)`
- `public boolean isEntityInvulnerable( DamageSource source)`
- `public boolean canAttackPlayer( EntityPlayer player)`
- `public void onDeath( DamageSource source)`
- `public void onUpdate()`
- `public Entity changeDimension(int dim)`
- `public void handleClientSettings( CPacketClientSettings pkt)`

## Description

Opens a GUI with this player, uses FML's IGuiHandler system.
