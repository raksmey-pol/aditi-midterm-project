# 1. Load .env correctly (most reliable way)
set -a          # automatically export all assignments
source .env     # or: . .env
set +a

# 2. Check that variables are actually set
echo "DB_URL=$DB_URL"
echo "PORT=$PORT"

# 3. Run with proper multi-line argument quoting
./mvnw spring-boot:run \
    -Dspring-boot.run.arguments="--spring.datasource.url=$DB_URL \
    --spring.datasource.username=$DB_USERNAME \
    --spring.datasource.password=$DB_PASSWORD \
    --server.port=$PORT \
    --jwt.secret=$JWT_SECRET \
    --allowed.cors=$ALLOWED_CORS"
    