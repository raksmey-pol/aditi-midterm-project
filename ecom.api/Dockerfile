# ============================================================
# Stage 1 – Build
# ============================================================
FROM eclipse-temurin:25-jdk AS builder

WORKDIR /app

# Copy Maven wrapper + descriptor first to leverage layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build (skip tests – they run in CI, not in image build)
COPY src ./src
RUN ./mvnw package -DskipTests -B

# ============================================================
# Stage 2 – Runtime
# ============================================================
FROM eclipse-temurin:25-jdk AS runtime

WORKDIR /app

# Unprivileged user for running the service
RUN groupadd --system spring && useradd --system --gid spring spring

# Copy the fat JAR produced in the build stage
COPY --from=builder /app/target/*.jar app.jar

# Directory for user-uploaded files (mounted as a volume in compose)
RUN mkdir -p uploads && chown spring:spring uploads

USER spring

EXPOSE 8000

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar"]
