# quick start guide

> 来源：https://www.liteloader.com/explore/docs/dev:quickstart
> 版本：1.10.2
> 页面 ID：dev:quickstart
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

# Quick Start Guide - for advanced users
Creating LiteLoader mods is very simple if you're already comfortable making mods using MCP:
Steps to create liteloader mods

* Setup [Eclipse](http://www.eclipse.org/)
* Install an SVN team provider and connector to Eclipse, I recommend [Subversive SVN](http://www.eclipse.org/subversive/) and SVNKit
* Create your [MCP](http://mcp.ocean-labs.de/) deployment
* Open the MCP Eclipse project
* Check out the [liteloader source from the SVN](https://subversion.assembla.com/svn/liteloader/). You will need to check out "LiteLoader/trunk" for the latest version of Minecraft, or check out the appropriate **tag** for older versions.
* Eclipse will detect the new project and include it in your workspace
* Edit the "Run Configuration" for Client
    * add the LiteLoader project to the build path
    * set the "Main Class" to **com.mumfrey.liteloader.debug.Start**
* Create a Project for your mod and set the dependent projects to "LiteLoader"
* Make a package in your project for your mod
* Create a class for your mod, the name of the mod class must begin with the text **LiteMod** (case sensitive) to allow LiteLoader to discover the class
* Implement one or more of the LiteLoader [Interfaces](dev:interfaces)
* Create a build script for your mod, I recommend using Ant since it's bundled with Eclipse
* Include a **litemod.json** file in your packaged mod otherwise LiteLoader will not load your mod

# Tips
* The **ModUtilities** class contains useful functions for mods to use
* Never implement both [.:interfaces:ChatFilter](.:interfaces:ChatFilter) and [.:interfaces:ChatListener](.:interfaces:ChatListener), only implement one of these interfaces.
* Avoid using the init() method for any tasks besides setting up your mod's resources since it is called before Minecraft is fully initialised. If you need to add hooks into the game or initialise parts of your mod that need Minecraft to be fully initialised, then implement [.:interfaces:InitCompleteListener](.:interfaces:InitCompleteListener) and use the **onInitCompleted** callback instead.
