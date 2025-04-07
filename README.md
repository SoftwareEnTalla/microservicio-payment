# PAYMENT Microservice

**Fecha de creación**: 2025-04-07

**Autor**: Ing. Persy Morell Guerra e Ing. Dailyn García Dominguez (SoftwarEnTalla CEO)

## Estructura del microservicio

```
.
|____src
| |____common
| | |____database
| | |____dto
| | | |____args
| | | |____inputs
| | |____helpers
| | |____logger
| | |____types
| |____config
| |____core
| | |____adapters
| | |____configs
| | |____loaders
| | |____services
| |____errors
| |____filters
| |____i18n
| |____interfaces
| |____migrations
| |____modules
| | |____payment
| | | |____aggregates
| | | |____commands
| | | | |____handlers
| | | |____config
| | | |____controllers
| | | |____decorators
| | | |____dtos
| | | |____entities
| | | |____events
| | | |____graphql
| | | |____guards
| | | |____interceptors
| | | |____modules
| | | |____queries
| | | | |____handlers
| | | |____repositories
| | | |____sagas
| | | |____services
| | | |____shared
| | | | |____event-store
| | | | |____messaging
| | | |____types
| |____utils
```
