# 1. Load .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $name = $matches[1]
        $value = $matches[2].Trim('"')
        Set-Item -Path Env:$name -Value $value
    }
}

# 2. Check variables
Write-Host "DB_URL=$Env:DB_URL"
Write-Host "PORT=$Env:PORT"

# 3. Run Spring Boot
$argsString = "--spring.datasource.url=$Env:DB_URL " +
              "--spring.datasource.username=$Env:DB_USERNAME " +
              "--spring.datasource.password=$Env:DB_PASSWORD " +
              "--server.port=$Env:PORT " +
              "--jwt.secret=$Env:JWT_SECRET " +
              "--allowed.cors=$Env:ALLOWED_CORS"

.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=$argsString"