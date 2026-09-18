# ForgeChunkManager.OrderedLoadingCallback

## Methods

- `java.util.List< ForgeChunkManager.Ticket > ticketsLoaded(java.util.List< ForgeChunkManager.Ticket > tickets, World world, int maxTicketCount)`

## Description

This is a special LoadingCallback that can be implemented as well as the LoadingCallback to provide access to additional behaviour. Specifically, this callback will fire prior to Forge dropping excess