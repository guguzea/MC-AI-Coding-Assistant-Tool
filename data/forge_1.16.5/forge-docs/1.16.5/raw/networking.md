---
version: "1.16.5"
forgeVersion: "36.2.34"
chapter: "networking"
source: "https://docs.readthedocs.net/en/1.16.x/networking/"
sourceType: mkdocs
---
# Networking

Communication between servers and clients is the backbone of a successful mod implementation.

Read an [overview](overview/) of why networking matters and the basic strategies in thinking about networking.

There are a variety of techniques provided by Forge to facilitate communication mostly built on top of [netty](https://netty.io).

The simplest, for a new mod, would be [SimpleImpl](simpleimpl/), where most of the complexity of the netty system is abstracted away. It uses a message and handler style system.