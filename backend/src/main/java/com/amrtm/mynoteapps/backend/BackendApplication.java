package com.amrtm.mynoteapps.backend;

import com.amrtm.mynoteapps.backend.repository.user.GroupRepoImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.r2dbc.R2dbcAutoConfiguration;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@SpringBootApplication(exclude = {R2dbcAutoConfiguration.class})
@EnableR2dbcRepositories(basePackages = "com.amrtm.mynoteapps.backend.repository")
public class BackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
}
