package com.project.surveyengine.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.http.HttpServletRequest;
import java.util.regex.Pattern;

/**
 * Created by gemas on 19/11/2015.
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityContext extends WebSecurityConfigurerAdapter {

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/statics/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .formLogin()
                .loginPage("/home")
                .usernameParameter("email")
                .and()
            .logout()
                .deleteCookies("JSESSIONID")
                .logoutUrl("/logout")
                .logoutSuccessUrl("/home?logout=true")
                .and()
            .authorizeRequests()
                .antMatchers(
                    "/init/**",
                    "/reports/files-report",
                    "/login/**",
                    "/error/**",
                    "/survey/{\\d+}/response/{\\d+}",
                    "/survey/{\\d+}/response/{\\d+}/submit",
                    "/survey/{\\d+}/response/{\\d+}/edit",
                    "/mail/new-survey/**",
                    "/mail/report/**",
                    "/mail/reminder/**",
                    "/survey/expiration",
                    "/admin/get/users-by-role",
                    "/reports/get/pre-report",
                    "/reports/get/final-report",
                    "/reports/get/final-executive-report",
                    "/reports/pre-report",
                    "/reports/final-report",
                    "/reports/final-executive-report",
                    "/signup/**",
                    "/home/**",
                    "/register/**",
                    "/_ah/**",
                    "/customerSTAR",
                    "/appstats/**"
//                  ,"/admin/**" //TODO REMOVE THIS IN PROD
                )
                .permitAll()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .antMatchers("/**").authenticated()
                .and()
            .rememberMe()
                .and()
            .csrf()
                .requireCsrfProtectionMatcher(new RequestMatcher() {
                    private Pattern allowedMethods = Pattern.compile("^(GET|HEAD|TRACE|OPTIONS)$");
                    private RegexRequestMatcher apiMatcher = new RegexRequestMatcher("/api/v[0-9]*/.*", null);
                    @Override
                    public boolean matches(HttpServletRequest request) {
                        //No CSRF due to allowedMethod
                        if(allowedMethods.matcher(request.getMethod()).matches())
                            return false;
                        // No CSRF due to api call
                        if(apiMatcher.matches(request))
                            return false;
                        // CSRF for everything else that is not an API call or an allowedMethod
                        return true;
                    }
                });
//        if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
            http.csrf().disable();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .userDetailsService(userDetailsService())
            .passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}