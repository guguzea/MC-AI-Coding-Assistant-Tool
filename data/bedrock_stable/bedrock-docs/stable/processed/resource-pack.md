> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/resourcepack?view=minecraft-bedrock-stable
> 抓取时间：2026-08-14T18:35:21.065Z
> 警告：此文档可能滞后于当前正式版

Create Custom Grass Blocks: An Introduction to Resource Packs | Microsoft Learn
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
					  Introduction to Resource Packs
			 Feedback
						Summarize this article for me
				In this article
					  Before building your first Add-On for Minecraft: Bedrock Edition, you'll need to create a pack to hold your custom content. There are two types of packs that a creator can make: resource packs and behavior packs. A  resource pack  is a folder structure that contains all of your custom models, sounds, textures, and other custom content.
 In this tutorial, you will learn:
 How a  resource pack  is created.
 How a  manifest file  is created.
 How custom textures are loaded into Minecraft: Bedrock Edition.
 The concept of  Pack Stacking  when working with Add-On content.
 Sample Resource Pack
 There is a  sample resource pack  available on the Minecraft samples GitHub. This pack may be used to understand the structure of resource packs and to check your work after you complete this tutorial.
 It's recommended you complete  Getting Started with Add-On Development  before beginning this tutorial.
 Building the Resource Pack
 For Minecraft to find and use your resource files, you must set up the folders and files in a specific way. This tutorial will guide you through creating this folder and file structure.
 Create a Resource Pack folder
 We will start by creating a folder called  My_RESOURCE_Pack . Technically you can name this folder anything you want, but the other folders have to be named exactly as specified in this tutorial so that Minecraft knows where to find the information.
 Locate com.mojang on a Windows device
 Open the  com.mojang  folder.
 Press  Win+R  to open  Run .
 If you are using main Minecraft releases, copy and paste the following into the  Open  field:  %appdata%\Minecraft Bedrock\users\shared\games\com.mojang
 Alternatively, if you are using preview Minecraft versions, see more information about the folder to use in  this article
 Click  OK .
 Double-click the  development_resource_packs  folder to open it.
 Add a new folder and name it  My_RESOURCE_Pack .
 Double-click the  My_RESOURCE_Pack  folder to open it.
 Create a manifest file
 To load a resource pack into Minecraft, we need a manifest file. The manifest file is a JSON file that contains the following information:
  Description : In-game description of what the resource pack does.
  Name : In-game name of the resource pack.
  UUID : Universally Unique Identifier.
  Version : Version of the resource pack.
  Minimum Engine Version : Minimum required version of Minecraft for this pack to work properly.
 Note
 To learn more about how a manifest.json file works, see the Addons Reference  manifest.json  documentation.
 Minecraft parses the information from the manifest file and displays it in the  Add-On  section of the game. Inside the file, the information is split into two separate sections: Header and modules. The header section contains the overall information for the pack, while the modules section contains the dedicated packages information. To create the manifest.json file:
 Right-click in the Explorer window, and select  New > Text Document .
 Name it  manifest.json .
 You will need to change the file extension from .txt to .json. If your Explorer window does not show file extensions, you can enable  File Name Extensions  under the  View  tab.
 Double-click the  manifest.json  file to open it in a text editor.
 Copy and paste the following code into your file.
  {
 "format_version": 2,
 "header": {
   "description": "My dirt resource pack Add-On!",
   "name": "My Resource Pack",
   "uuid": "<FIRST GENERATED UUID>",
   "version": [1, 0, 0],
   "min_engine_version": [1, 16, 0]
  },
 "modules": [
   {
     "description": "My First Add-On!",
     "type": "resources",
     "uuid": "<SECOND GENERATED UUID>",
     "version": [1, 0, 0]
   }
 ]
}
 Set the UUID
 A Universally Unique Identifier (UUID) is a unique number used for identification purposes. For Minecraft, the UUID is used to define a specific pack and to prevent any duplicate software from causing issues. For the header and modules, there will need to be two different UUID numbers entered in each of the  "uuid"  fields between the quotes. You can get UUIDs from an online UUID Generator such as  https://www.uuidgenerator.net/ .
 Copy and paste a UUID into the header section. The UUID will need to be pasted in the  "uuid":""  field between the quotation ("") marks to be read correctly.
 Refresh the webpage to generate a new UUID for use in the Modules section.
 Copy and paste the new UUID into the modules section in the  "uuid"  field between the quotation marks.
 Save the manifest.json file.
 Changing the dirt block
 With the manifest file completed, you can now start adding custom content to Minecraft. Let's get started by applying a new texture to the Vanilla dirt block. The first part of the process involves creating a folder structure to hold the custom texture.
 Open the  My_RESOURCE_Pack  folder and create a folder named  textures .
 Double-click the  textures  folder to open it.
 Open the  textures  folder and create a folder named  blocks .
 Double-click the  blocks  folder to open it.
 Create the texture
 Now that the folder structure is created, we can start adding some custom textures. This green square is an example of the type of file created using the following steps.
 You can download this green block and save it in your  blocks  folder or follow these steps to create your texture:
 Open up an image editor such as MS Paint.
 Go to the  File  menu and select  Properties .
 Set the  Width  and  Height  to  16 pixels  each.
 Click  OK .
 You can now design a pattern or any artwork in the editor. To make the green square, a simple fill color was added.
 Note
 MS Paint is used in this example for quick and easy access, but you will need to use a different graphics editor for more advanced graphic features like transparency effects or .tga file support.
 After editing the texture, go to the  File  menu and select  Save As .
 Choose the  PNG picture  option.
 In the  Save As  dialog box, navigate to the  blocks  folder.
 Save the file as  dirt.png .
 Test the pack
 Now that the pack has both a manifest file and a texture file, you can launch Minecraft and test your new resource Add-On.
 Important
  Pack Stacking  is how content is loaded on top of Vanilla content, causing each object that has the same name in both packs to be overwritten by the  latest  applied pack. In our example, the original dirt texture is overwritten by the custom texture.
 If another pack that uses the dirt.png file is loaded  after  My_RESOURCE_Pack, then Minecraft will use that file instead.
 Your custom texture will be used on every dirt.png block in the world, but it will not be used on blocks of dirt with grass on them because those blocks have a different name.
 Launch Minecraft and select  Play .
 Select  Create New World .
 Under  Settings , scroll down to the  Add-Ons  section.
 Click on  Resource Packs  to see all available packs.
 Click the  MY PACKS  drop-down.
 Select  My RESOURCE Pack  and click  Activate  to add the resource pack to the world.
 Click  Create .
 Troubleshooting
 Resource pack woes? Don't worry, troubleshooting is a normal part of any development process.
 You can use the  sample resource pack  on the Minecraft samples GitHub site to check the structure of your resource pack.
 Your Resource Pack does not appear in minecraft
 If your resource pack does not appear in the Add-Ons section of a world, the issue may be a malformed  manifest.json  file. Let's investigate.
 Are there two different UUIDs in the  manifest.json  header and modules section? See the  UUID  section for more information.
 Have you turned on file extensions and paths? If your Explorer window does not show file extensions, you can enable  File Name Extensions  under the  View  tab.
 Double-check JSON curly braces and brackets. JSON linting tools can help.
 Resource Pack shows up, content doesn't work
 Check that the  textures  folder is in the right place, and spelled correctly. Then check the  blocks  folder as well.
 Download the  Vanilla resource pack  and try adding your block to the existing  textures/blocks  folder.
 Make sure the new texture file is named the same as the Vanilla texture it's replacing.
 Move your pack above others to ensure your  dirt.png  texture is loaded before other resource packs.
 What's Next?
 With a custom texture now a part of your Minecraft world, it's time to make a more advanced block.
  Custom Die Block
 If you haven't checked out Behavior Packs yet, follow this simple tutorial to add aggressive behavior to a normally peaceful cow.
  Behavior pack
 To see examples of unchanged resource and behavior files, check out the Minecraft  Vanilla Resource Pack  and  Vanilla Behavior Pack .
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
		2026-01-28
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
