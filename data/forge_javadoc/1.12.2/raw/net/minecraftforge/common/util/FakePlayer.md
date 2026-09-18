---
title: "FakePlayer"
description: "Opens a GUI with this player, uses FML's IGuiHandler system."
package: "net/minecraftforge/common/util"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/util/FakePlayer.html"
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

- `public Vec3d getPositionVector()`
- `public boolean canUseCommand(int i, java.lang.String s)`
- `public void sendStatusMessage( ITextComponent chatComponent, boolean actionBar)`
- `public void sendMessage( ITextComponent component)`
- `public void addStat( StatBase par1StatBase, int par2)`
- `public void openGui(java.lang.Object mod, int modGuiId, World world, int x, int y, int z)`
- `public boolean isEntityInvulnerable( DamageSource source)`
- `public boolean canAttackPlayer( EntityPlayer player)`
- `public void onDeath( DamageSource source)`
- `public void onUpdate()`
- `public Entity changeDimension(int dim, ITeleporter teleporter)`
- `public void handleClientSettings( CPacketClientSettings pkt)`
- `public MinecraftServer getServer()`

## Description

Opens a GUI with this player, uses FML's IGuiHandler system.
