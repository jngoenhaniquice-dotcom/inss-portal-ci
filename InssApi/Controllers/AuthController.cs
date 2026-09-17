using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InssApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace InssApi.Controllers;

/// <summary>M14 — login público (sem [Authorize]). Devolve o crachá JWT para o portal.</summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _cfg;

    public AuthController(IConfiguration cfg) => _cfg = cfg;

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        // Demo de aula — sem tabela de usuários (assunto de outro módulo)
        if (req.Email != "ana@inss.gov.mz" || req.Senha != "1234")
            return Unauthorized("E-mail ou senha inválidos.");

        var chave = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_cfg["Jwt:Chave"]!));

        var cred = new SigningCredentials(
            chave, SecurityAlgorithms.HmacSha256);

        // claims = campos gravados dentro do crachá
        var token = new JwtSecurityToken(
            issuer: _cfg["Jwt:Emissor"],
            claims: new[]
            {
                new Claim(ClaimTypes.Name, "Ana Mucavel"),
                new Claim(ClaimTypes.Email, req.Email)
            },
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: cred);

        // Contrato com o React: { token, nome, email }
        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            nome = "Ana Mucavel",
            email = req.Email
        });
    }
}
