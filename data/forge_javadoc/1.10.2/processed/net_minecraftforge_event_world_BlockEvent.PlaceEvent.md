# BlockEvent.PlaceEvent

## Constructors

- `public PlaceEvent( BlockSnapshot blockSnapshot, IBlockState placedAgainst, EntityPlayer player, @Nullable EnumHand hand)`

## Methods

- `@Deprecated public PlaceEvent( BlockSnapshot blockSnapshot, IBlockState placedAgainst, EntityPlayer player)`
- `public EntityPlayer getPlayer()`
- `@Nullable public ItemStack getItemInHand()`
- `public BlockSnapshot getBlockSnapshot()`
- `public IBlockState getPlacedBlock()`
- `public IBlockState getPlacedAgainst()`
- `@Nullable public EnumHand getHand()`

## Description

Called when a block is placed by a player. If a Block Place event is cancelled, the block will not be placed.