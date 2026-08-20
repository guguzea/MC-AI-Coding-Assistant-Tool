# modloader

> 来源：https://www.liteloader.com/explore/docs/info:modloader
> 版本：1.12.2
> 页面 ID：info:modloader
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

# Risugami's ModLoader
**ModLoader** was a simplistic [ModSystem](ModSystem) developed by [people:Risugami](people:Risugami) primarily to provide support and compatibility for his own mods but also made available to other modders to allow them to also leverage the increased compatibility thus afforded. In the early days of modding, *"base modding"* (creating mods by simply modifying the game's base code) was the *de facto* modding method and as such compatibility between mods was largely a matter of mods just happening to edit different classes.

Amongst the various attempts to create some kind of compatibility layer, **ModLoader** became the most popular and was the modding platform of choice for a lengthy period, its relative stability was also attractive to modders since they could focus update efforts on the *Minecraft* codebase itself and not worry about **ModLoader** changing too much since [people:Risugami](people:Risugami) rarely added new features. Larger mods could still utilise "base modding" techniques, and use **ModLoader**'s compatibility at the same time to strike a balance between compatibility and scope.

However [people:Risugami](people:Risugami)'s lack of attention to the project started to become a problem for modders. As the game began to change more heavily as *Mojang*'s focus shifted towards a long-term goal of building their own API, **ModLoader** became increasingly more problematic a dependency for modders, with updates taking longer to emerge and containing bugs which went unpatched rendering some mods unworkable.

In early 2012, the [Minecraft Forge](forge) project - which had previously been using **ModLoader** as its underlying mod-loading solution - undertook an effort to build their own, compatible, alternative to **ModLoader** which became [FML](FML). At around the same time the **LiteLoader** project was started, with the aim of providing a lighter-weight, more reliable alternative to **ModLoader** for client-side mods to use.

[people:Risugami](people:Risugami) continued to maintain **ModLoader** for a time, but the growth of [Forge](Forge), and a lack of active development which left later releases crippled and barely functional eventually led to the project's termination, with the last available version being released for *Minecraft 1.6.2*, although community-provided patches were required to make this version work properly.
