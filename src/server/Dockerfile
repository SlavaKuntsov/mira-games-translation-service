FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

COPY ["server/TranslationService.API/TranslationService.API.csproj", "server/TranslationService/TranslationService.API/"]
COPY ["server/TranslationService.Application/TranslationService.Application.csproj", "server/TranslationService/TranslationService.Application/"]
COPY ["server/TranslationService.Persistence/TranslationService.Persistence.csproj", "server/TranslationService/TranslationService.Persistence/"]
COPY ["server/SharedKernel/Databases/Databases.csproj", "server/SharedKernel/Databases/"]
COPY ["server/SharedKernel/Domain/Domain.csproj", "server/SharedKernel/Domain/"]
COPY ["server/SharedKernel/Common/Common.csproj", "server/SharedKernel/Common/"]

RUN dotnet restore "server/TranslationService.API/TranslationService.API.csproj"

COPY . . 

RUN dotnet publish "server/TranslationService.API/TranslationService.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime
WORKDIR /app
EXPOSE 7001

COPY --from=build /app/publish . 

ENTRYPOINT ["dotnet", "TranslationService.API.dll"]