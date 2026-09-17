using System.Text;
using System.Text.Json.Serialization;
using InssApi.Data;
using InssApi.Middleware;
using InssApi.Repositories;
using InssApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// Dia 4 · manhã · M15 — mesma API do Dia 3 tarde (JWT). Hoje acrescentamos testes.

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<IContribuinteRepository, ContribuinteRepository>();
builder.Services.AddScoped<IPedidoRepository, PedidoRepository>();
builder.Services.AddScoped<IContribuinteService, ContribuinteService>();
builder.Services.AddScoped<IPedidoService, PedidoService>();

builder.Services.AddCors(o => o.AddPolicy("portal", p =>
    p.WithOrigins("http://localhost:5173")
     .AllowAnyHeader()
     .AllowAnyMethod()));

var chaveJwt = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Chave"]!));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Emissor"],
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = chaveJwt
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseMiddleware<ErrosMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("portal");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

// Preciso para WebApplicationFactory nos testes de integração (M15)
public partial class Program { }
