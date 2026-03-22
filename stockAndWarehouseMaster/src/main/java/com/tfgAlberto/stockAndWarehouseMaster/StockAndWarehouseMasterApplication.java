package com.tfgAlberto.stockAndWarehouseMaster;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class StockAndWarehouseMasterApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockAndWarehouseMasterApplication.class, args);
	}

	@Bean
    public ScheduledExecutorService scheduledExecutorService() {
        return Executors.newScheduledThreadPool(15);
    }
}
