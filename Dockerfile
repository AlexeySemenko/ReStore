# Step 1: Build .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /app
EXPOSE 8080

# Copy csproj and restore as distinct layers
COPY API/*.csproj ./API/
RUN dotnet restore API/*.csproj

# Copy everything else and build
COPY API ./API/
RUN dotnet publish API -c Release -o /app/out

# Step 2: Build Frontend
FROM node:20 AS frontend-build
WORKDIR /client
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend files and build them
COPY client ./
RUN npm run build -- --outDir /app/out/wwwroot

# Step 3: Build Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Copy the backend and frontend output to the final image
COPY --from=backend-build /app/out /app
COPY --from=frontend-build /app/out/wwwroot /app/wwwroot

ENTRYPOINT ["dotnet", "API.dll"]
