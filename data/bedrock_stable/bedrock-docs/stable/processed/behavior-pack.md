> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/behaviorpack?view=minecraft-bedrock-stable
> 抓取时间：2026-08-14T18:35:21.902Z
> 警告：此文档可能滞后于当前正式版

Create an Angry Cow: An Introduction To Behavior Packs | Microsoft Learn
			Skip to main content
			Skip to Ask Learn chat experience
					 This browser is no longer supported.
						Upgrade to Microsoft Edge to take advantage of the latest features, security updates, and technical support.
							Download Microsoft Edge
							More info about Internet Explorer and Microsoft Edge
				  Table of contents
				 Exit editor mode
			 Ask Learn
			 Ask Learn
			 Reading mode
			 Table of contents
			 Read in English
			 Add
			 Add to Plans
			 Edit
					 Copy Markdown
					 Print
						 Note
						Access to this page requires authorization. You can try  signing in  or  changing directories .
						Access to this page requires authorization. You can try  changing directories .
					  Introduction to Behavior Packs
			 Feedback
						Summarize this article for me
				In this article
					  Before building your first Add-On for Minecraft: Bedrock Edition, you'll need to create a pack to hold your custom content. There are two types of packs that a creator can make: resource packs and behavior packs. A  behavior pack  is a folder structure that contains files that drive entity behaviors, loot drops, spawn rules, items, recipes, and trade tables.
 This tutorial covers how behavior packs are created and how to add behaviors to an in-game cow entity to make it aggressive.
 On the Minecraft Creator Channel
 If you prefer to watch a video version of this tutorial, you can view it on the  Minecraft Creator Channel ,  available here .
 Tutorial Overview
 In this tutorial, you will learn the following:
 How to change an entity's behavior in Minecraft: Bedrock Edition.
 How to link a Behavior Pack to a Resource Pack.
 Note
 The current version of this tutorial uses mctools.dev to simplify the process of creating a behavior pack. If you'd prefer to see creating a behavior pack "from scratch",  see this article .
 Requirements
 It's recommended you complete these before beginning this tutorial:
  Getting Started with Add-On Development
  Introduction To Resource Packs
 Building the Behavior Pack
 A behavior pack contains files that creators use to add, remove, or alter gameplay behavior of entities within Minecraft. An entity's behavior file is what makes each entity do certain actions, like how a chicken follows a player who's holding seeds.
 For Minecraft to find and use your behavior files, you have to set up the folders and files in a particular structure. This tutorial will guide you through creating this folder and file structure.
 Use mctools.dev to Get Started
 In this section, we'll get started with a toolset called  Minecraft Creator Tools . This toolset is an open source project from Mojang that helps do all of the management work of creating a new project.
  Start by visiting  mctools.dev .
  In the Add-On Starter section, click New.
  In the Title field, give your project a name like  myBehaviorPack .
  Enter your name in the Creator Name field.
  Notice that a Short Name is generated for your project, but you can change this.
  You can also add a Description for your project.
  Click OK.
 Understand the Project Files
 MCTools will add all of the files your project needs. You can click the "Eye" button to show all related files.
 If you right-click on a file and select  View as JSON , you can see the contents of that file.
 If you view the manifest file for the behavior pack, you will notice several elements.
 The behavior pack manifest file is similar to the one created for the resource pack, but it has two additional sections.
  modules  - Defines the pack so that Minecraft knows how to apply it to the world. Behavior packs use the  data  type.
  dependencies  - Creates a link between behavior packs and resource packs to add custom textures and visuals to Minecraft.
 Note
 To learn more about how a manifest.json file works, see the Add-Ons Reference  manifest.json  documentation.
 Add a Cow
 To add a cow to your project, select the down arrow next to new script. Select the New Mob button.
 Select the cow and click Add.
 Make the Cow an Angry Cow
 Select the cow JSON file underneath Entity Types.
 Within the Components section of the JSON, add the following elements which turns cows into aggressive killing machines:
              "minecraft:behavior.nearest_attackable_target": {
                "priority": 2,
                "must_see": true,
                "reselect_targets": true,
                "within_radius": 25.0,
                "entity_types": [
                    {
                        "filters": {
                            "test": "is_family",
                            "subject": "other",
                            "value": "player"
                        },
                        "max_dist": 32
                    }
                ]
            },
            "minecraft:behavior.melee_attack": {
                "priority": 3
            },
            "minecraft:attack": {
                "damage": 3
            },
 Test the Pack
 Now that the behavior pack has a modified cow entity, it is time to launch Minecraft and test your new Add-On.
  Within MCTools.dev, select Run and then Flat World with Packs.
  Within the Downloads section of your browser, click Open file to open the downloaded file. The file should now open and import into Minecraft.
  Launch Minecraft and select  Play .
  Select the world that was just imported. The file should be named based on your project and the time at which it was saved.
  Summon your cow using the summon command:  /summon cont_bp:cow  (Your namespace might vary based on your creator name.)
  Your cow might not attack you in creative mode, so select  /gamemode s  to turn the world into a survival world.
 Adding Your Pack to Minecraft
 Once you verify that your behavior pack works on  mctools.dev , the final step is configuring the pack to be recognized by your local Minecraft instance. Check out this  Introduction to Scripting  for a guide on best practices for configuring and editing your new behavior pack.
 Troubleshooting
 Behavior pack woes? Troubleshooting is a normal part of any development process. Here are some places to begin troubleshooting a behavior pack:
  Check the  content error logs  for detected problems that could cause instability or unpredictable behavior.
  Use the  sample behavior pack  on the Minecraft samples Github to check the structure of your behavior pack.
 What's Next?
 Now that you have seen a behavior pack in action, you can learn more about how they work and what else you can do with them.
  Creating New Entity Types
 Entity JSON Documentation
 To see examples of unchanged resource and behavior files, check out the Minecraft  Vanilla resource pack  and  Vanilla behavior Pack .
			 Feedback
					Was this page helpful?
						 Yes
						 No
							 No
								Need help with this topic?
								Want to try using Ask Learn to clarify or guide you through this topic?
			 Ask Learn
			 Ask Learn
				  Suggest a fix?
				Additional resources
				 Last updated on
		2025-04-23
			 In this article
					Was this page helpful?
								Need help with this topic?
								Want to try using Ask Learn to clarify or guide you through this topic?
			 Ask Learn
			 Ask Learn
				  Suggest a fix?
		      en-us
			 Your Privacy Choices
				 Theme
							  Light
							  Dark
							  High contrast
		 AI Disclaimer
		 Previous Versions
		 Blog
		 Contribute
		 Privacy
		 Consumer Health Privacy
		 Terms of Use
		 Trademarks
				 &copy; Microsoft 2026
