# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-alpine
LABEL authors="kyler"

# Set the working directory in the container
WORKDIR /app

# Copy the application JAR file into the container
#COPY target/your-spring-boot-app.jar /app/app.jar
COPY target/*.jar /app/app.jar

# Expose the port the app runs on
EXPOSE 8080


# Authors
LABEL maintainer="LeeJayCodes <jaewoo.lee@hc-sc.gc.ca>" \
      contributor="WildRyc <kyle.ryc@hc-sc.gc.ca>, ulrich-jato <jato.guiffokengne@hc-sc.gc.ca>"

# Run the application
CMD ["java", "-jar", "app.jar"]