> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/gettingstarted?view=minecraft-bedrock-stable
> 抓取时间：2026-08-14T18:35:19.858Z
> 警告：此文档可能滞后于当前正式版

Getting Started with Minecraft Add-Ons | Microsoft Learn
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
					  Getting Started with Add-On Development for Bedrock Edition
			 Feedback
						Summarize this article for me
				In this article
					  Whether you create them yourself or get them from another creator, Add-Ons are the first step on the journey of bringing greater levels of customization to Minecraft: Bedrock Edition. Add-ons allow players to transform the look of their worlds and even change the behavior of entities. For example, you can change the blast radius of a creeper and the texture it's wearing.
 In this article, you'll learn:
 How to download Add-Ons for various devices.
 The file structure used by Minecraft Add-Ons.
 How Visual Studio Code can be used for editing JSON files.
 Where to find applicable extensions for Visual Studio Code.
 Installing Add-Ons
 Add-Ons can be installed on a variety of platforms running Minecraft. Here's how:
 Windows 10 or Windows 11
 Realms/Console
 Android
 iOS
 Oculus Rift
 First, you'll need a Windows 10 or Windows 11 computer with Minecraft: Bedrock Edition installed.
 Download the world or Add-On file from the provided source. If the file downloads as a .zip file, change the file extension name to ".mcworld" or ".mcpack".
 Navigate to the directory where you downloaded the file.
 Open the file and the Add-On should open in Minecraft.
 If you're opening a .mcworld that contains Add-Ons, the game will notify you that you've successfully imported the world. It will then be available from the "Play" menu.
 If you're opening a .mcpack, a pop-up notification will alert you that you've successfully imported the pack. Depending on the pack type, this will then be available when editing worlds in either the Behavior Pack tab or Resource Pack tab.
 You will need a Windows 10 or Windows 11 computer with Minecraft: Bedrock Edition installed, a subscription to Realms, and a Minecraft world with Add-Ons activated.
 On the computer, launch Minecraft and upload the world with Add-Ons active to your realm.
 Go to your console, launch Minecraft, and open the Add-On enhanced world on the realm.
 Launch Minecraft.
 Download the world or Add-On file to your Android device.
 Go to the Settings app and select  Storage > Explore  (at the bottom). If you do not have a settings app, you can install a file explorer app like ES File Explorer.
 Select the directory where you saved the file, usually "Download".
 Select the file & the Add-On should open in Minecraft.
 If you're opening a .mcworld that contains Add-Ons, the game will notify you that you've successfully imported the world. It will then be available from the "Play" menu.
 If you're opening a .mcpack, a pop-up notification will alert you that you've successfully imported the pack. Depending on the pack type, this will then be available when editing worlds in either the Behavior Pack tab or Resource Pack tab.
 Launch Minecraft.
 Tap on the world or Add-On file you want to open (URL, e-mail attachment, etc.).
 Your device will prompt you to open the file with Minecraft.
 Tap  Open in Minecraft . This will launch Minecraft with your selected file.
 If you're opening a .mcworld that contains Add-Ons, the game will notify you that you've successfully imported the world. It will then be available from the "Play" menu.
 If you're opening a .mcpack, a pop-up notification will alert you that you've successfully imported the pack. Depending on the pack type, this will then be available when editing worlds in either the Behavior Pack tab or Resource Pack tab.
 Open Minecraft for Windows 10 in Rift Mode (if not in Rift mode, Add-Ons will open in the regular version of Minecraft for Windows 10).
 Download the world or Add-On file from the provided source (URL, email attachment, etc.). If the file downloads as a .zip file, change the file extension name to ".mcworld" or ".mcpack".
 Navigate to the directory where you downloaded the file.
 Open the file, and the Add-On should open in Minecraft.
 If you're opening a .mcworld that contains Add-Ons, the game will notify you that you've successfully imported the world. It will then be available from the "Play" menu.
 If you're opening a .mcpack, a pop-up notification will alert you that you've successfully imported the pack. Depending on the pack type, this will then be available when editing worlds in either the Behavior Pack tab or Resource Pack tab.
 The com.mojang folder
 A folder called  com.mojang  was added to the AppData folder during Minecraft installation. You'll need to find this folder so you can add your content to it.
 To locate the  com.mojang  folder on your computer, you'll need to have the  Hidden items  checkbox set to  true , as shown below. Also, check the box for  File name extensions .
 Showing hidden items
 Open  File Explorer  from the taskbar.
 Select the  View  tab.
 In the  Show/hide  section, select the checkboxes for  File name extensions  and  Hidden items .
 Locating com.mojang on a Windows device
 Press  Win+R  to open  Run .
 If you are using the main Minecraft releases, copy and paste the following into the  Open  field:  %appdata%\Minecraft Bedrock\users\shared\games\com.mojang
 Alternatively, if you are using preview Minecraft versions, see more information about the folder to use in  this article
 Click  OK .
 Tip
 This is a great time to save a shortcut to this folder on your desktop.
 As shown in the image below, there are multiple subdirectories located within the  com.mojang  folder.
 Tip
 If you see more content in this folder than what is shown above, do not panic! This image shows a fresh install of Minecraft.
 Behavior, Skin, and Resource Packs
 There are three folders called  behavior_packs ,  resource_packs , and  skin_packs  that will store finalized custom content that will be added to Minecraft: Bedrock Edition. Don't worry about these folders right now; you're going to be developing content, so you'll be working in the development versions of these folders, as discussed in the next section.
 Development Packs
 Use the  development_resource_packs  and  development_behavior_packs  folders for the  Resource Pack  and  Behavior Pack  tutorials. Development pack folders are updated each time Minecraft is launched, so you can quickly load and test the changes you made to their contents.
 minecraftWorlds
  minecraftWorlds  contains each world that has been generated within the current build of Minecraft. Each folder also contains resource and behavior pack folders for any packs that may be in use within the world.
 Tip
 When installing a new build of Minecraft, you should save a copy of this folder as a backup to prevent any potential loss of Minecraft worlds that you may have.
 Visual Studio Code
 The files you'll be creating to customize Minecraft: Bedrock Edition will be written in JSON, a popular format for describing data. JSON can be edited in any text editor such as Notepad or Word, but it's easier to edit it with a programming editor that understands JSON natively. Microsoft's Visual Studio Code is a free programming editor that not only works great with JSON, it supports extensions that add functionality—including some built specifically for Bedrock development.
 Installing Visual Studio Code
 Follow this link to  install Visual Studio Code .
 Visual Studio Code Extensions
 Visual Studio Code supports extensions created by the Visual Studio Code developer community. Extensions are a great way to help write and understand Minecraft syntax when working on resource and behavior packs.
 Here's two recommended extensions for Minecraft development:
  Blockception's Minecraft Bedrock Development
  Bedrock Definitions
 What's next?
 Now that your development environment is set up, you can start creating your first add-on and learn more about resource packs.
  Introduction to Resource Packs
 Alternatively, if you'd like to learn how to use commands, head on over to  Getting Started with Command Blocks  and learn how to use command blocks to chain together different commands.
  Getting Started with Command Blocks
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
		2025-07-22
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
