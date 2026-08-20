# ModSystems

> 来源：https://www.liteloader.com/explore/docs/info:modsystem
> 版本：1.10.2
> 页面 ID：info:modsystem
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

# ModSystems for Minecraft
#### history
In the early days of Minecraft modding, modders used to just make direct changes to the game code and redistribute these changes as bundles of java `.class` files or as patches. This was not the most user-friendly experience since if two mods edited the same file then they would conflict, and often neither of them would work.

Whilst a **ModSystem** is itself a mod, the aim of a **ModSystem** is to remove conflicts between other mods by separating them from the game code, and instead provide a platform for modders to build on, allowing many mods to inter-operate without conflicting. The most ubiquitous system to emerge was a system called [ModLoader](ModLoader), made by [people:Risugami](people:Risugami). Despite its shortcomings, [ModLoader](ModLoader)'s ubiquity made it the platform of choice for many modders for a long time, however a lack of active development slowly brought [ModLoader](ModLoader)'s flaws into sharper relief, and led alternative solutions to be sought.

In early 2012, a growing project known as [Minecraft Forge](forge), which had previously been building atop a combination of [people:Risugami](people:Risugami)'s [ModLoader](ModLoader) and [ScottyDoesKnow (SDK)](people:sdk)'s companion product [ModLoaderMP](ModLoaderMP), started development of [their own Mod Loader](fml) to be a replacement for both of the previous dependencies, with the aim of building a more sturdy mod platform going forward. However the decision was made to retain backwards compatibility with [ModLoader](ModLoader).

At around the same time, **LiteLoader** was born and headed in the opposite direction: reducing the scope and payload of [ModLoader](ModLoader) in favour of building a small, solid core which client-only mods could leverage, but using a much more robust mod loading mechanism to do so and abandoning backward compatibility with [ModLoader](ModLoader).

The two efforts continued in their respective directions until early 2013, with the advent of [Mojang](https://www.mojang.com)'s new launcher platform, which suddenly opened up an entirely new universe of possibilities for modding, in the form of [Tweaks](tweak).

The new opportunities presented a new problem though: with the new way of hooking into the game, only one [tweak](tweak) was possible at a time. To overcome this limitation, [people:cpw](people:cpw), the author of [Forge ModLoader](fml), and myself worked together to agree a mutual standard where whichever [tweak](tweak) was loaded first would agree to load the other, using a standard we termed 'cascading'. [people:Risugami](people:Risugami), who refused to embrace the new technology, and who by this point was maintaining his own [ModLoader](ModLoader) seemingly at arms'-length and with considerable disinterest, stuck with the old form of jar modding, which only worked to further cement [ModLoader](ModLoader)'s growing irrelevance.

Meanwhile, the increasing cooperation between [people:cpw](people:cpw), myself and other active members of the community meant that we could now discuss and refine the tweak system a little more. [people:cpw](people:cpw) was able to improve the [Tweak](Tweak) system to support multiple tweaks, and provide a common area where **ModSystems** could share information with each other.

With the arrival of the Minecraft 1.7 update, [FML](FML) managed to divest itself of its [ModLoader](ModLoader) backward-compatibility roots, and proved to be the final nail in [ModLoader](ModLoader)'s coffin, with [people:Risugami](people:Risugami) opting not to update. This left [FML](FML) and **LiteLoader** as the remaining active **ModSystems**, with both systems honouring the implicit [ModSystem Contract](info:modsystem:contract) which [people:cpw](people:cpw) and I came to agree upon.

#### ModSystems Today
Whilst **ModSystems** today are still technically mods in the strictest sense, the differences from early **ModSystems** like [ModLoader](ModLoader) are pronounced. Modern **ModSystems** use much more advanced methods of modifying the game, and do so at run time rather than 'pre-patching' their code into the game, this process is typically referred to as 'injecting' or 'patching', where changes are intelligently applied to the game as it loads.

This type of modification is much less brittle than the old form of replacing entire `.class` files, and allows multiple changes to be made to the same class without conflicts occurring, since changes can be detected and adapted to on-the-fly.
