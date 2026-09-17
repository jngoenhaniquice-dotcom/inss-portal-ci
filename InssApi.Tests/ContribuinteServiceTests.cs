using InssApi.Models;
using InssApi.Repositories;
using InssApi.Services;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace InssApi.Tests;

/// <summary>M15 — unitário: testa o Service com Moq no Repository (sem HTTP, sem SQLite).</summary>
public class ContribuinteServiceTests
{
    private readonly Mock<IContribuinteRepository> _repo = new();
    private readonly ContribuinteService _sut;

    public ContribuinteServiceTests()
    {
        _sut = new ContribuinteService(_repo.Object, NullLogger<ContribuinteService>.Instance);
    }

    [Fact]
    public async Task Criar_NuitCurto_DeveFalhar()
    {
        // Arrange
        var nuit = "123"; // precisa de 9 dígitos (regra do M8)

        // Act
        var (ok, erro, criado) = await _sut.CriarAsync(nuit, "Ana", CancellationToken.None);

        // Assert
        Assert.False(ok);
        Assert.Contains("9 dígitos", erro);
        Assert.Null(criado);
        _repo.Verify(r => r.AdicionarAsync(It.IsAny<Contribuinte>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Criar_NuitDuplicado_DeveFalhar()
    {
        // Arrange — Moq: o repositório “já tem” esse NUIT
        _repo.Setup(r => r.ObterPorNuitAsync("123456789", It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Contribuinte { Id = 1, Nuit = "123456789", Nome = "Outra" });

        // Act
        var (ok, erro, _) = await _sut.CriarAsync("123456789", "Ana", CancellationToken.None);

        // Assert
        Assert.False(ok);
        Assert.Contains("já cadastrado", erro);
    }

    [Fact]
    public async Task Criar_DadosValidos_DeveSalvar()
    {
        // Arrange
        _repo.Setup(r => r.ObterPorNuitAsync("987654321", It.IsAny<CancellationToken>()))
            .ReturnsAsync((Contribuinte?)null);

        // Act
        var (ok, erro, criado) = await _sut.CriarAsync("987654321", "Ana Mucavel", CancellationToken.None);

        // Assert
        Assert.True(ok);
        Assert.Null(erro);
        Assert.NotNull(criado);
        Assert.Equal("Ana Mucavel", criado!.Nome);
        _repo.Verify(r => r.AdicionarAsync(It.IsAny<Contribuinte>(), It.IsAny<CancellationToken>()), Times.Once);
        _repo.Verify(r => r.SalvarAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
