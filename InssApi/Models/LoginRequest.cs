namespace InssApi.Models;

// M14 — corpo do POST /api/auth/login (casa com { email, senha } no React)
public record LoginRequest(string Email, string Senha);
