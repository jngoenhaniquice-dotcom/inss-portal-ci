# Dia 3 · Tarde · back (M14)

**Continua** a API da manhã (`manha\back` = CORS + porta 5088).

Acrescenta:
- pacote JWT + bloco `Jwt` no `appsettings.json`
- `AuthController` → `POST /api/auth/login`
- `[Authorize]` em Contribuintes e Pedidos
- pipeline: `UseCors` → `UseAuthentication` → `UseAuthorization`

Login demo: `ana@inss.gov.mz` / `1234`

Visual Studio → esta pasta → F5 → `/swagger`
