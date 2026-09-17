using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using InssApi.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace InssApi.Tests;

/// <summary>M15 — fábrica: sobe a API em memória com SQLite de teste.</summary>
public class InssApiFactory : WebApplicationFactory<Program>
{
    private readonly string _dbPath = Path.Combine(Path.GetTempPath(), $"inss-test-{Guid.NewGuid():N}.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");

        builder.ConfigureServices(services =>
        {
            var remover = services
                .Where(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>)
                         || (d.ServiceType.IsGenericType
                             && d.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>)))
                .ToList();
            foreach (var d in remover)
                services.Remove(d);

            // Também remove o AppDbContext registrado pelo AddDbContext
            var ctx = services.Where(d => d.ServiceType == typeof(AppDbContext)).ToList();
            foreach (var d in ctx)
                services.Remove(d);

            services.AddDbContext<AppDbContext>(o => o.UseSqlite($"Data Source={_dbPath}"));

            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureCreated();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        try { if (File.Exists(_dbPath)) File.Delete(_dbPath); } catch { /* ignore */ }
    }
}

/// <summary>M15 — integração: HTTP real (login JWT + listar com Bearer).</summary>
public class AuthApiTests : IClassFixture<InssApiFactory>
{
    private readonly HttpClient _client;

    public AuthApiTests(InssApiFactory factory) => _client = factory.CreateClient();

    [Fact]
    public async Task Login_Valido_DeveRetornarToken()
    {
        // Arrange / Act
        var r = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "ana@inss.gov.mz",
            senha = "1234"
        });

        // Assert
        Assert.Equal(HttpStatusCode.OK, r.StatusCode);
        var json = await r.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(json.TryGetProperty("token", out var token));
        Assert.False(string.IsNullOrWhiteSpace(token.GetString()));
    }

    [Fact]
    public async Task Login_Invalido_DeveRetornar401()
    {
        var r = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "ana@inss.gov.mz",
            senha = "errada"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, r.StatusCode);
    }

    [Fact]
    public async Task Listar_SemToken_DeveRetornar401()
    {
        var r = await _client.GetAsync("/api/contribuintes");
        Assert.Equal(HttpStatusCode.Unauthorized, r.StatusCode);
    }

    [Fact]
    public async Task Listar_ComToken_DeveRetornar200()
    {
        var login = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "ana@inss.gov.mz",
            senha = "1234"
        });
        var json = await login.Content.ReadFromJsonAsync<JsonElement>();
        var token = json.GetProperty("token").GetString();

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var r = await _client.GetAsync("/api/contribuintes");

        Assert.Equal(HttpStatusCode.OK, r.StatusCode);
    }
}
