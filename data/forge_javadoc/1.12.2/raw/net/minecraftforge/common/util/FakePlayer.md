---
title: "FakePlayer"
description: "public class FakePlayer extends EntityPlayerMP"
package: "net/minecraftforge/common/util"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/util/FakePlayer.html"
sourceType: javadoc
---

# FakePlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.entity.player.EntityPlayerMP → net.minecraftforge.common.util.FakePlayer

## Class signature

```java
public class FakePlayer extends EntityPlayerMP
```

## Methods

- `void addStat(StatBase par1StatBase, int par2)`
- `boolean canAttackPlayer(EntityPlayer player)`
- `boolean canUseCommand(int i, java.lang.String s)`
- `Entity changeDimension(int dim, ITeleporter teleporter)`
- `Vec3d getPositionVector()`
- `MinecraftServer getServer()`
- `void handleClientSettings(CPacketClientSettings pkt)`
- `boolean isEntityInvulnerable(DamageSource source)`
- `void onDeath(DamageSource source)`
- `void onUpdate()`
- `void openGui(java.lang.Object mod, int modGuiId, World world, int x, int y, int z)` — Opens a GUI with this player, uses FML's IGuiHandler system.
- `void sendMessage(ITextComponent component)`
- `void sendStatusMessage(ITextComponent chatComponent, boolean actionBar)`

## Fields

- `FakePlayer`
