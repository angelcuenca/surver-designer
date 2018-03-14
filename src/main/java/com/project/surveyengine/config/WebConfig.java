package com.project.surveyengine.config;

import com.project.surveyengine.helper.GMultipartResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.UrlBasedViewResolver;

/**
 * Created by gerardo_martinez on 9/06/16.
 */
@Configuration
@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter{

  @Bean
  UrlBasedViewResolver resolver(){
    UrlBasedViewResolver resolver = new UrlBasedViewResolver();
    resolver.setPrefix("/views/");
    resolver.setSuffix(".jsp");
    resolver.setViewClass(JstlView.class);
    return resolver;
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/statics/**").addResourceLocations("/statics/");
  }

  @Bean
  public GMultipartResolver multipartResolver(){
    GMultipartResolver commonsMultipartResolver = new GMultipartResolver();
    //200KB File Size Limit
    commonsMultipartResolver.setMaxUploadSize(2000000);
    return commonsMultipartResolver;
  }




}
