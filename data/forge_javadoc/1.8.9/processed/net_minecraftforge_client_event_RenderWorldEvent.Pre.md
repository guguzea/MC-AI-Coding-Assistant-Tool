# RenderWorldEvent.Pre

## Constructors

- `public Pre( WorldRenderer renderer, ChunkCache chunkCache, int pass)`

## Description

Fired when 16x16x16 chunk area is being redrawn. Fired after GL state is setup, before tessellator is started.