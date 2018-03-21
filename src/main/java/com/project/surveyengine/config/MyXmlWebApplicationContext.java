package com.project.surveyengine.config;

import com.google.appengine.api.utils.SystemProperty;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.web.context.support.XmlWebApplicationContext;

/**
 * Created by project on 20/11/2015.
 * Disabling XML Validation in Production
 * To further reduce the loading time of an application, you can disable XML validation in production:
 */
public class MyXmlWebApplicationContext extends XmlWebApplicationContext {
    protected void initBeanDefinitionReader(XmlBeanDefinitionReader beanDefinitionReader) {
        super.initBeanDefinitionReader(beanDefinitionReader);
        if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production) {
            beanDefinitionReader.setValidating(false);
            beanDefinitionReader.setNamespaceAware(true);
        }
    }
}
