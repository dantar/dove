FROM eclipse-temurin:21-jdk
WORKDIR /app
RUN mkdir /logs
RUN mkdir /data
COPY dove-rest.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]