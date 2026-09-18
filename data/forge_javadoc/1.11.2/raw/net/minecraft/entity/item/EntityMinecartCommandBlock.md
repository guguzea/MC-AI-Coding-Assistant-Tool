---
title: "EntityMinecartCommandBlock"
description: "public class EntityMinecartCommandBlock extends EntityMinecart"
package: "net/minecraft/entity/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/item/EntityMinecartCommandBlock.html"
sourceType: javadoc
---

# EntityMinecartCommandBlock

## Class signature

```java
public class EntityMinecartCommandBlock extends EntityMinecart
```

## Constructors

- `public EntityMinecartCommandBlock( World worldIn)`
- `public EntityMinecartCommandBlock( World worldIn, double x, double y, double z)`

## Methods

- `public static void registerFixesMinecartCommand( DataFixer fixer)`
- `protected void entityInit()`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `public EntityMinecart.Type getType()`
- `public IBlockState getDefaultDisplayTile()`
- `public CommandBlockBaseLogic getCommandBlockLogic()`
- `public void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `public boolean processInitialInteract( EntityPlayer player, EnumHand hand)`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public boolean ignoreItemEntityData()`
