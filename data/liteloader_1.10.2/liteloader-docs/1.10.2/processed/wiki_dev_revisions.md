# Version and Revision

> 来源：https://www.liteloader.com/explore/docs/dev:revisions
> 版本：1.10.2
> 页面 ID：dev:revisions
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

# Version and Revision
A source of some confusion is the inclusion of both a **version** and a **revision** in the [mod metadata](litemod.json) which accompanies every litemod. What is this nonsense of two attributes that sound like they mean the same thing? Why do you need them? I attempt to explain that here.

## Version Numbers
Every piece of software has a **version**, it's an intrinsic piece of information that naturally accompanies any piece of software and mods - being software - are no different. You might release version "1.0" of your mod and later release a bugfix which makes it version "1.0.1". But wait? What's with the multiple decimal points? Well version numbers aren't rational numbers, they're more like an identifier which describes not only the global sequence of the software, but also describe something about the level of changes between each version.

Some versioning schemes also include a build number or letter such as 1.0.1a or 1.0.1.4. Version descriptors don't even have to be numerical, or they can include other information such as a suffix indicating an alpha, beta or release candidate build such as "RC".

The point is that a version is more than just a number, and to support this LiteLoader mods expose their version as a String, to allow any format of version to be used.

## Where "revision" comes in
With the arrival of the new launcher however, the identification of valid mods becomes more difficult and more important, and some way of identifying to the loader which version of a mod is "newer" is required. This is where the concept of **revision** comes in.

Unlike version, which is exposed to the user and as previously mentioned can be any string, revision is purely used internally to establish a timeline of mod releases, the requirements being that revision must be a number and must increase over time, other than that there are no restrictions or requirements. Revision must simply be a higher number for a later version.

A good candidate for revision would be the build number, this can be included easily in your build script using the ant buildnumber task, or alternatively a float or integer-based representation of the version itself can be used, as long as the number increases for every build of your mod, the choice is up to you.
