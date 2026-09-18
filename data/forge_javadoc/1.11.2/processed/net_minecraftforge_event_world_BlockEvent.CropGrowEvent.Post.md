# BlockEvent.CropGrowEvent.Post

## Constructors

- `public Post( World world, BlockPos pos, IBlockState original, IBlockState state)`

## Methods

- `public IBlockState getOriginalState()`

## Description

Fired when "growing age" blocks (for example cacti, chorus plants, or crops in vanilla) have successfully grown. The block's original state is available, in addition to its new state. This event is no