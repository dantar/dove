FROM eclipse-temurin:21-jdk
WORKDIR /app
RUN mkdir /logs
RUN mkdir /data
COPY dove-rest.jar app.jar
EXPOSE 8080
EXPOSE 8081
HEALTHCHECK --start-period=30s --timeout=10s CMD curl --fail -X GET http://localhost:8081/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]