/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.api;

import java.io.File;
import java.io.FilenameFilter;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import com.google.common.base.Charsets;
import com.mumfrey.liteloader.api.EnumeratorModule;
import com.mumfrey.liteloader.common.LoadingProgress;
import com.mumfrey.liteloader.core.LiteLoaderVersion;
import com.mumfrey.liteloader.core.api.EnumeratorModuleFiles.ContainerEnvironment.Candidate;
import com.mumfrey.liteloader.interfaces.LoadableFile;
import com.mumfrey.liteloader.interfaces.LoadableMod;
import com.mumfrey.liteloader.interfaces.ModularEnumerator;
import com.mumfrey.liteloader.interfaces.TweakContainer;
import com.mumfrey.liteloader.launch.LoaderEnvironment;
import com.mumfrey.liteloader.launch.LoaderProperties;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger.Verbosity;

import net.minecraft.launchwrapper.LaunchClassLoader;

public abstract class EnumeratorModuleFiles implements FilenameFilter, EnumeratorModule
{
    public static class ContainerEnvironment implements Iterable<ContainerEnvironment.Candidate>
    {
        static class Candidate
        {
            private final Set<LoadableMod<File>> availableFiles = new TreeSet<LoadableMod<File>>();
            
            private boolean isRegistered;

            public void add(LoadableMod<File> modFile)
            {
                if (!this.isRegistered)
                {
                    this.availableFiles.add(modFile);
                }
            }
            
            public LoadableMod<File> getNewestVersion()
            {
                return this.availableFiles.iterator().next();
            }
            
            public boolean isRegistered()
            {
                return this.isRegistered;
            }
            
            public void register()
            {
                this.isRegistered = true;
            }
        }
        
        /**
         * Ordered sets used to sort mods by version/revision  
         */
        private final Map<String, Candidate> orderedCandidates = new LinkedHashMap<String, Candidate>();

        public void addCandidate(LoadableMod<File> modFile)
        {
            if (!this.orderedCandidates.containsKey(modFile.getModName()))
            {
                this.orderedCandidates.put(modFile.getModName(), new Candidate());
            }

            LiteLoaderLogger.info("Considering valid mod file: %s", modFile);
            this.orderedCandidates.get(modFile.getModName()).add(modFile);
        }
        
        @Override
        public Iterator<Candidate> iterator()
        {
            return this.orderedCandidates.values().iterator();
        }
    }
    
    /**
     * Ordered sets used to sort mods by version/revision  
     */
    private final ContainerEnvironment containers;

    /**
     * Mods to add once init is completed
     */
    private final List<LoadableMod<File>> loadableMods = new ArrayList<LoadableMod<File>>();

    protected final LiteLoaderCoreAPI api;

    public EnumeratorModuleFiles(LiteLoaderCoreAPI api, ContainerEnvironment containers)
    {
        this.api = api;
        this.containers = containers;
    }

    protected abstract boolean readJarFiles();

    protected abstract boolean loadTweakJars();

    protected abstract boolean loadTweaks();

    protected abstract boolean forceInjection();

    protected abstract File[] getFiles();

    @Override
    public void init(LoaderEnvironment environment, LoaderProperties properties)
    {
    }

    /**
     * Write settings
     */
    @Override
    public void writeSettings(LoaderEnvironment environment, LoaderProperties properties)
    {
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.core.Enumerator#getLoadableMods()
     */
    public List<LoadableMod<File>> getLoadableMods()
    {
        return this.loadableMods;
    }

    /**
     * For FilenameFilter interface
     * 
     * @see java.io.FilenameFilter#accept(java.io.File, java.lang.String)
     */
    @Override
    public boolean accept(File dir, String fileName)
    {
        fileName = fileName.toLowerCase();

        if (fileName.endsWith(".litemod.zip"))
        {
            LiteLoaderLogger.warning("Found %s with unsupported extension .litemod.zip."
                    + " Please change file extension to .litemod to allow this file to be loaded!", fileName);
            return true;
        }

        return fileName.endsWith(".litemod") || fileName.endsWith(".jar");
    }

    /**
     * Search the folder for (potentially) valid files
     */
    protected void findValidFiles(ModularEnumerator enumerator)
    {
        for (File file : this.getFiles())
        {
            LoadableFile candidateFile = new LoadableFile(file);
            candidateFile.setForceInjection(this.forceInjection());
            try
            {
                this.inspectFile(enumerator, candidateFile);
            }
            catch (Exception ex)
            {
                LiteLoaderLogger.warning(ex, "An error occurred whilst inspecting %s", candidateFile);
            }
        }
    }

    /**
     * Check whether a particular file is valid, and add it to the candiates
     * list if it appears to be acceptable.
     * 
     * @param enumerator
     * @param candidateFile
     */
    protected void inspectFile(ModularEnumerator enumerator, LoadableFile candidateFile)
    {
        if (this.isValidFile(enumerator, candidateFile))
        {
            String metaData = candidateFile.getFileContents(LoadableMod.METADATA_FILENAME, Charsets.UTF_8);
            if (metaData != null)
            {
                LoadableMod<File> modFile = this.getModFile(candidateFile, metaData);
                this.addModFile(enumerator, modFile);
                return;
            }
            else if (this.isValidTweakContainer(candidateFile))
            {
                TweakContainer<File> container = this.getTweakFile(candidateFile);
                this.addTweakFile(enumerator, container);
                return;
            }
            else
            {
                LiteLoaderLogger.info("Ignoring %s", candidateFile);
//                enumerator.registerBadContainer(candidateFile, "No metadata");
            }
        }
//        else
//        {
//            enumerator.registerBadContainer(candidateFile, "Not a valid file");
//        }
    }

    /**
     * Check whether the specified file is a valid mod container
     * 
     * @param enumerator
     * @param candidateFile
     */
    protected boolean isValidFile(ModularEnumerator enumerator, LoadableFile candidateFile)
    {
        String filename = candidateFile.getName().toLowerCase();
        if (filename.endsWith(".litemod.zip"))
        {
            enumerator.registerBadContainer(candidateFile, "Invalid file extension .litemod.zip");
            return false;
        }
        else if (filename.endsWith(".litemod"))
        {
            return true;
        }
        else if (filename.endsWith(".jar"))
        {
            Set<String> modSystems = candidateFile.getModSystems();
            boolean hasLiteLoader = modSystems.contains("LiteLoader");
            if (modSystems.size() > 0)
            {
                LiteLoaderLogger.info("%s supports mod systems %s", candidateFile, modSystems);
                if (!hasLiteLoader) return false;
            }

            return this.loadTweakJars() || this.readJarFiles() || hasLiteLoader;
        }

        return false;
    }

    /**
     * Called only if the file is not a valid mod container (has no mod
     * metadata) to check whether it could instead be a potential tweak
     * container.
     * 
     * @param candidateFile
     */
    protected boolean isValidTweakContainer(LoadableFile candidateFile)
    {
        return this.loadTweakJars() && this.loadTweaks() && candidateFile.getName().toLowerCase().endsWith(".jar");
    }

    /**
     * Get the {@link FilenameFilter} to use to filter candidate files
     */
    protected FilenameFilter getFilenameFilter()
    {
        return this;
    }

    /**
     * @param modFile
     */
    protected boolean isFileSupported(LoadableMod<File> modFile)
    {
        return LiteLoaderVersion.CURRENT.isVersionSupported(modFile.getTargetVersion());
    }

    /**
     * @param candidateFile
     * @param metaData
     */
    protected LoadableMod<File> getModFile(LoadableFile candidateFile, String metaData)
    {
        return new LoadableModFile(candidateFile, metaData);
    }

    /**
     * @param candidateFile
     */
    protected TweakContainer<File> getTweakFile(LoadableFile candidateFile)
    {
        return candidateFile;
    }

    /**
     * @param enumerator 
     * @param modFile
     */
    protected void addModFile(ModularEnumerator enumerator, LoadableMod<File> modFile)
    {
        if (modFile.hasValidMetaData())
        {
            // Only add the mod if the version matches, we add candidates to the versionOrderingSets in
            // order to determine the most recent version available.
            if (this.isFileSupported(modFile))
            {
                this.containers.addCandidate(modFile);
            }
            else
            {
                LiteLoaderLogger.info(Verbosity.REDUCED, "Not adding invalid or version-mismatched mod file: %s", modFile);
                enumerator.registerBadContainer(modFile, "Version not supported");
            }
        }
    }

    /**
     * @param enumerator
     * @param container
     */
    protected void addTweakFile(ModularEnumerator enumerator, TweakContainer<File> container)
    {
        enumerator.registerTweakContainer(container);
    }

    /**
     * @param enumerator 
     */
    protected void sortAndRegisterFiles(ModularEnumerator enumerator)
    {
        // Copy the first entry in every version set into the modfiles list
        for (Candidate candidate : this.containers)
        {
            if (candidate.isRegistered())
            {
                continue;
            }
            
            LoadableMod<File> newestVersion = candidate.getNewestVersion();
            this.registerFile(enumerator, newestVersion);
            candidate.register();
        }
    }

    /**
     * @param enumerator
     * @param modFile
     */
    @SuppressWarnings("unchecked")
    protected void registerFile(ModularEnumerator enumerator, LoadableMod<File> modFile)
    {
        if (enumerator.registerModContainer(modFile))
        {
            LiteLoaderLogger.info(Verbosity.REDUCED, "Adding newest valid mod file '%s' at revision %.4f", modFile, modFile.getRevision());
            this.loadableMods.add(modFile);
        }
        else
        {
            LiteLoaderLogger.info(Verbosity.REDUCED, "Not adding valid mod file '%s', the specified mod is disabled or missing a required dependency",
                    modFile);
        }

        if (this.loadTweaks())
        {
            try
            {
                if (modFile instanceof TweakContainer)
                {
                    this.addTweakFile(enumerator, (TweakContainer<File>)modFile);
                }
            }
            catch (Throwable th)
            {
                LiteLoaderLogger.warning("Error adding tweaks from '%s'", modFile);
            }
        }
    }

    @Override
    public void injectIntoClassLoader(ModularEnumerator enumerator, LaunchClassLoader classLoader)
    {
        LiteLoaderLogger.info("Injecting external mods into class path...");

        for (LoadableMod<?> loadableMod : this.loadableMods)
        {
            try
            {
                if (loadableMod.injectIntoClassPath(classLoader, false))
                {
                    LiteLoaderLogger.info("Successfully injected mod file '%s' into classpath", loadableMod);
                }
            }
            catch (MalformedURLException ex)
            {
                LiteLoaderLogger.warning("Error injecting '%s' into classPath. The mod will not be loaded", loadableMod);
            }
        }
    }

    @Override
    public void registerMods(ModularEnumerator enumerator, LaunchClassLoader classLoader)
    {
        LiteLoaderLogger.info(Verbosity.REDUCED, "Discovering mods in valid mod files...");
        LoadingProgress.incTotalLiteLoaderProgress(this.loadableMods.size());

        for (LoadableMod<?> modFile : this.loadableMods)
        {
            LoadingProgress.incLiteLoaderProgress("Searching for mods in " + modFile.getModName() + "...");
            LiteLoaderLogger.info("Searching %s...", modFile);
            try
            {
                enumerator.registerModsFrom(modFile, true);
            }
            catch (Exception ex)
            {
                LiteLoaderLogger.warning("Error encountered whilst searching in %s...", modFile);
            }
        }
    }
}
