# BlockEvent.CreateFluidSourceEvent

## Constructors

- `public CreateFluidSourceEvent( World world, BlockPos pos, IBlockState state)`

## Description

Fired to check whether a non-source block can turn into a source block. A result of ALLOW causes a source block to be created even if the liquid usually doesn't do that (like lava), and a result of DE