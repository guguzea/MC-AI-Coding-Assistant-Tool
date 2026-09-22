---
title: "EntityClientPlayerMP"
description: "public class EntityClientPlayerMP extends EntityPlayerSP"
package: "net/minecraft/client/entity"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/entity/EntityClientPlayerMP.html"
sourceType: javadoc
---

# EntityClientPlayerMP

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.client.entity.AbstractClientPlayer → net.minecraft.client.entity.EntityPlayerSP → net.minecraft.client.entity.EntityClientPlayerMP

## Class signature

```java
public class EntityClientPlayerMP extends EntityPlayerSP
```

## Constructors

- `EntityClientPlayerMP(Minecraft p_i45064_1_, World p_i45064_2_, Session p_i45064_3_, NetHandlerPlayClient p_i45064_4_, StatFileWriter p_i45064_5_)`

## Methods

- `void addStat(StatBase p_71064_1_, int p_71064_2_)`
- `boolean attackEntityFrom(DamageSource p_70097_1_, float p_70097_2_)`
- `void closeScreen()`
- `void closeScreenNoPacket()`
- `protected void damageEntity(DamageSource p_70665_1_, float p_70665_2_)`
- `EntityItem dropOneItem(boolean p_71040_1_)`
- `protected void func_110318_g()`
- `void func_110322_i()`
- `void func_142020_c(java.lang.String p_142020_1_)`
- `java.lang.String func_142021_k()`
- `StatFileWriter getStatFileWriter()`
- `void heal(float p_70691_1_)`
- `void joinEntityItemWithWorld(EntityItem p_71012_1_)`
- `void mountEntity(Entity p_70078_1_)`
- `void onUpdate()`
- `void respawnPlayer()`
- `void sendChatMessage(java.lang.String p_71165_1_)`
- `void sendMotionUpdates()`
- `void sendPlayerAbilities()`
- `void setPlayerSPHealth(float p_71150_1_)`
- `void swingItem()`

## Fields

- `NetHandlerPlayClient sendQueue`
