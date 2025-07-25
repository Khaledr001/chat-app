# Development stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dev
WORKDIR /app

# Install Entity Framework Core tools
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Copy csproj and restore as distinct layers
COPY ["ChatApp.Server/ChatApp.Server.csproj", "ChatApp.Server/"]
RUN dotnet restore "ChatApp.Server/ChatApp.Server.csproj"

# Copy everything else
COPY . .

# Set working directory
WORKDIR "/app/ChatApp.Server"

# Expose ports
EXPOSE 5153
EXPOSE 7172

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://localhost:5153;https://localhost:7172
ENV DOTNET_USE_POLLING_FILE_WATCHER=1

# Command to run on container start in development mode
ENTRYPOINT ["dotnet", "watch", "run", "--no-restore"]




