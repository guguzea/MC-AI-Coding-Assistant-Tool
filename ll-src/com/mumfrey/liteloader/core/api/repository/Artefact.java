/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.api.repository;

import java.io.File;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Specifier for a mod in the ivy repo shorthand notation
 */
public final class Artefact
{
    /**
     * Regex for matching valid specifiers
     */
    private static final Pattern PATTERN = Pattern.compile("^([^:]+):([^:]+):([^:@]+?)(:([^:@]+?))?(@(zip|jar|litemod))?$"); 
    
    /**
     * Artefact group id
     */
    private final String group;
    
    /**
     * Artefact name
     */
    private final String name;
    
    /**
     * Artefact version
     */
    private final String version;
    
    /**
     * Artefact classifier (can be null)
     */
    private final String classifier;
    
    /**
     * Artefact type (can be null)
     */
    private final String type;
    
    /**
     * Resolved file 
     */
    private File file;

    public Artefact(String specifier)
    {
        if (specifier == null)
        {
            throw new IllegalArgumentException("Invalid artefact specifier: null");
        }
        
        Matcher matcher = Artefact.PATTERN.matcher(specifier);
        if (!matcher.matches())
        {
            throw new IllegalArgumentException("Invalid artefact specifier: " + specifier);
        }
        
        this.group = matcher.group(1);
        this.name = matcher.group(2);
        this.version = matcher.group(3);
        this.classifier = matcher.group(5);
        this.type = matcher.group(7);
    }
    
    /**
     * Get the artefact id consisting of the group and name
     * 
     * @return
     */
    public String getArtefactId()
    {
        return String.format("%s:%s", this.getGroup(), this.getName());
    }

    /**
     * Get the path portion of this artefact's resolved location
     * 
     * @return artefact path
     */
    public String getPath()
    {
        return String.format("%s/%s/%s", this.getGroup().replace('.', '/'), this.getName(), this.getVersion());
    }
    
    /**
     * Get the file name portion of this artefact's resolved location
     * 
     * @return arefact file name
     */
    public String getFileName()
    {
        return String.format("%s-%s%s.%s", this.getName(), this.getVersion(), this.getClassifier("-"), this.getType());
    }
    
    /**
     * Get the artefact group
     */
    public String getGroup()
    {
        return this.group;
    }
    
    /**
     * Get the artefact name
     */
    public String getName()
    {
        return this.name;
    }
    
    /**
     * Get the artefact version
     */
    public String getVersion()
    {
        return this.version;
    }

    /**
     * Get the artefact classifier, returns an empty string if no classifier is
     * set
     */
    public String getClassifier()
    {
        return this.getClassifier("");
    }

    private String getClassifier(String prefix)
    {
        return this.classifier != null ? prefix + this.classifier : "";
    }

    /**
     * Get the artefact type, defaults to "jar" if no type was specified
     */
    public String getType()
    {
        return this.type != null ? this.type : "jar";
    }
    
    /**
     * Resolve this artefact beneath the specified repository root
     * 
     * @param repositoryRoot repository root
     * @return resolved file
     */
    void resolve(File repositoryRoot)
    {
        this.file = new File(new File(repositoryRoot, this.getPath()), this.getFileName());
    }
    
    /**
     * Get whether the resolved artefact actually exists
     */
    public boolean exists()
    {
        return this.file != null && this.file.isFile();
    }
    
    /**
     * After resolution, return the resolved file location
     * 
     * @return resolved location
     */
    public File getFile()
    {
        return this.file;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {
        String type = this.type != null && !"jar".equals(this.type) ? "@" + this.type : "";
        return String.format("%s:%s:%s%s%s", this.getGroup(), this.getName(), this.getVersion(), this.getClassifier(":"), type);
    }
}
