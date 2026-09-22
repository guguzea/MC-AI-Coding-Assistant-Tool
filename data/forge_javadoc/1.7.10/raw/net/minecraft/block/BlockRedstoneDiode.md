---
title: "BlockRedstoneDiode"
description: "public abstract class BlockRedstoneDiode extends BlockDirectional"
package: "net/minecraft/block"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/block/BlockRedstoneDiode.html"
sourceType: javadoc
---

# BlockRedstoneDiode

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockDirectional → net.minecraft.block.BlockRedstoneDiode

## Class signature

```java
public abstract class BlockRedstoneDiode extends BlockDirectional
```

## Constructors

- `BlockRedstoneDiode(boolean p_i45400_1_)`

## Methods

- `boolean canBlockStay(World p_149718_1_, int p_149718_2_, int p_149718_3_, int p_149718_4_)`
- `boolean canPlaceBlockAt(World p_149742_1_, int p_149742_2_, int p_149742_3_, int p_149742_4_)`
- `boolean canProvidePower()`
- `protected void func_149897_b(World p_149897_1_, int p_149897_2_, int p_149897_3_, int p_149897_4_, Block p_149897_5_)`
- `protected int func_149899_k(int p_149899_1_)`
- `protected abstract int func_149901_b(int p_149901_1_)`
- `protected int func_149902_h(IBlockAccess p_149902_1_, int p_149902_2_, int p_149902_3_, int p_149902_4_, int p_149902_5_)`
- `protected int func_149904_f(IBlockAccess p_149904_1_, int p_149904_2_, int p_149904_3_, int p_149904_4_, int p_149904_5_)`
- `protected boolean func_149905_c(int p_149905_1_)`
- `boolean func_149907_e(Block p_149907_1_)`
- `protected boolean func_149908_a(Block p_149908_1_)`
- `boolean func_149910_g(IBlockAccess p_149910_1_, int p_149910_2_, int p_149910_3_, int p_149910_4_, int p_149910_5_)`
- `protected void func_149911_e(World p_149911_1_, int p_149911_2_, int p_149911_3_, int p_149911_4_)`
- `boolean func_149912_i(World p_149912_1_, int p_149912_2_, int p_149912_3_, int p_149912_4_, int p_149912_5_)`
- `protected int func_149913_i(IBlockAccess p_149913_1_, int p_149913_2_, int p_149913_3_, int p_149913_4_, int p_149913_5_)`
- `protected abstract BlockRedstoneDiode getBlockPowered()`
- `protected abstract BlockRedstoneDiode getBlockUnpowered()`
- `IIcon getIcon(int p_149691_1_, int p_149691_2_)`
- `protected int getInputStrength(World p_149903_1_, int p_149903_2_, int p_149903_3_, int p_149903_4_, int p_149903_5_)`
- `int getRenderType()`
- `boolean isAssociatedBlock(Block p_149667_1_)`
- `protected boolean isGettingInput(World p_149900_1_, int p_149900_2_, int p_149900_3_, int p_149900_4_, int p_149900_5_)`
- `boolean isOpaqueCube()`
- `int isProvidingStrongPower(IBlockAccess p_149748_1_, int p_149748_2_, int p_149748_3_, int p_149748_4_, int p_149748_5_)`
- `int isProvidingWeakPower(IBlockAccess p_149709_1_, int p_149709_2_, int p_149709_3_, int p_149709_4_, int p_149709_5_)`
- `static boolean isRedstoneRepeaterBlockID(Block p_149909_0_)`
- `void onBlockAdded(World p_149726_1_, int p_149726_2_, int p_149726_3_, int p_149726_4_)`
- `void onBlockDestroyedByPlayer(World p_149664_1_, int p_149664_2_, int p_149664_3_, int p_149664_4_, int p_149664_5_)`
- `void onBlockPlacedBy(World p_149689_1_, int p_149689_2_, int p_149689_3_, int p_149689_4_, EntityLivingBase p_149689_5_, ItemStack p_149689_6_)`
- `void onNeighborBlockChange(World p_149695_1_, int p_149695_2_, int p_149695_3_, int p_149695_4_, Block p_149695_5_)`
- `boolean renderAsNormalBlock()`
- `boolean shouldSideBeRendered(IBlockAccess p_149646_1_, int p_149646_2_, int p_149646_3_, int p_149646_4_, int p_149646_5_)`
- `void updateTick(World p_149674_1_, int p_149674_2_, int p_149674_3_, int p_149674_4_, java.util.Random p_149674_5_)`

## Fields

- `protected boolean isRepeaterPowered`
