/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.runtime;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import com.google.common.io.Files;

import joptsimple.internal.Strings;

public class SrgContainer
{
    
    private final Map<String, String> packageMap = new HashMap<String, String>();
    private final Map<String, String> classMap = new HashMap<String, String>();
    private final Map<SrgField, SrgField> fieldMap = new HashMap<SrgField, SrgField>();
    private final Map<SrgMethod, SrgMethod> methodMap = new HashMap<SrgMethod, SrgMethod>();
    
    private final Map<String, String> reversePackageMap = new HashMap<String, String>();
    private final Map<String, String> reverseClassMap = new HashMap<String, String>();
    private final Map<SrgField, SrgField> reverseFieldMap = new HashMap<SrgField, SrgField>();
    private final Map<SrgMethod, SrgMethod> reverseMethodMap = new HashMap<SrgMethod, SrgMethod>();
    
    public void readSrg(File srg) throws IOException
    {
        for (String line : Files.readLines(srg, Charset.defaultCharset()))
        {
            if (Strings.isNullOrEmpty(line) || line.startsWith("#"))
            {
                continue;
            }
            
            String type = line.substring(0, 2);
            String[] args = line.substring(4).split(" ");
            
            if ("PK".equals(type))
            {
                this.packageMap.put(args[0], args[1]);
                this.reversePackageMap.put(args[1], args[0]);
            }
            else if ("CL".equals(type))
            {
                this.classMap.put(args[0], args[1]);
                this.reverseClassMap.put(args[1], args[0]);
            }
            else if ("FD".equals(type))
            {
                SrgField field1 = new SrgField(args[0]);
                SrgField field2 = new SrgField(args[1]);
                this.fieldMap.put(field1, field2);
                this.reverseFieldMap.put(field2, field1);
            }
            else if ("MD".equals(type))
            {
                SrgMethod method1 = new SrgMethod(args[0], args[1]);
                SrgMethod method2 = new SrgMethod(args[2], args[3]);
                this.methodMap.put(method1, method2);
                this.reverseMethodMap.put(method2, method1);
            }
        }
    }

    public SrgMethod getMethodMapping(String owner, String name, boolean reverse)
    {
        Map<SrgMethod, SrgMethod> map = reverse ? this.reverseMethodMap : this.methodMap;
        
        for (Entry<SrgMethod, SrgMethod> mapping : map.entrySet())
        {
            SrgMethod method = mapping.getKey();
            if (owner.equals(method.getOwner()) && name.equals(method.getSimpleName()))
            {
                return mapping.getValue();
            }
        }
        
        return null;
    }
    
    public SrgField getFieldMapping(String owner, String name, boolean reverse)
    {
        Map<SrgField, SrgField> map = reverse ? this.reverseFieldMap : this.fieldMap;
        
        for (Entry<SrgField, SrgField> mapping : map.entrySet())
        {
            SrgField field = mapping.getKey();
            if (owner.equals(field.getOwner()) && name.equals(field.getName()))
            {
                return mapping.getValue();
            }
        }
        
        return null;
    }

    public SrgMethod getMethodMapping(SrgMethod methodName)
    {
        return this.methodMap.get(methodName);
    }
    
    public SrgField getFieldMapping(SrgField fieldName)
    {
        return this.fieldMap.get(fieldName);
    }
    
    public String getClassMapping(String className)
    {
        return this.classMap.get(className);
    }
    
    public String getPackageMapping(String packageName)
    {
        return this.packageMap.get(packageName);
    }
    
}
