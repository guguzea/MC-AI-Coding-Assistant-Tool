---
title: "FakePlayer"
description: "public class FakePlayer extends EntityPlayerMP"
package: "net/minecraftforge/common/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/util/FakePlayer.html"
sourceType: javadoc
---

# FakePlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.entity.player.EntityPlayerMP → net.minecraftforge.common.util.FakePlayer

## Class signature

```java
public class FakePlayer extends EntityPlayerMP
```

## Methods

- `void addChatComponentMessage(IChatComponent chatmessagecomponent)`
- `void addStat(StatBase par1StatBase, int par2)` — Adds a value to a statistic field.
- `boolean canAttackPlayer(EntityPlayer player)`
- `boolean canCommandSenderUseCommand(int i, java.lang.String s)` — Returns true if the CommandSender is allowed to execute the command, false if not
- `Vec3 getPositionVector()` — Get the position vector.
- `void handleClientSettings(C15PacketClientSettings pkt)`
- `boolean isEntityInvulnerable(DamageSource source)`
- `void onDeath(DamageSource source)` — Called when the mob's health reaches 0.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void openGui(java.lang.Object mod, int modGuiId, World world, int x, int y, int z)` — Opens a GUI with this player, uses FML's IGuiHandler system.
- `void travelToDimension(int dim)` — Teleports the entity to another dimension.

## Fields

- `FakePlayer`
