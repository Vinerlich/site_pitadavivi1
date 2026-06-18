using System.Globalization; 
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 🛑 CONFIGURAÇÃO DO CORS: Libera o acesso para o seu front-end (Live Server ou qualquer origem)
builder.Services.AddCors(options => 
{
    options.AddPolicy("PermitirTudo", policy => 
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 🛑 ATIVAÇÃO DO CORS: Ativa a regra de liberação logo após o build do app
app.UseCors("PermitirTudo");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configurações e Regras de Negócio
const string CEP_ORIGEM = "04254010";
const decimal VALOR_POR_KM = 2.0m;
const string TOMTOM_KEY = "VVM1ugso9FG0ZK8beliJIFU259BquVuY";
const double MAX_DISTANCIA_KM = 50.0; // 🛑 Nova regra de limite de distância

// Coordenadas reais da Avenida Paulista (CEP 01310200)
const double LAT_ORIGEM = -23.617718977504047;
const double LON_ORIGEM = -46.59379180536275;

app.MapPost("/api/frete", async (FreteRequest request, IHttpClientFactory clientFactory) =>
{
    if (string.IsNullOrWhiteSpace(request.CepDestino))
    {
        return Results.BadRequest(new { mensagem = "O CEP de destino é obrigatório." });
    }

    var httpClient = clientFactory.CreateClient();

    // 1. VALIDAÇÃO DE ENDEREÇO (ViaCEP)
    ViaCepResponse? dadosEndereco;
    try
    {
        dadosEndereco = await httpClient.GetFromJsonAsync<ViaCepResponse>($"https://viacep.com.br/ws/{request.CepDestino}/json/");
        if (dadosEndereco == null || dadosEndereco.Erro)
        {
            return Results.BadRequest(new { mensagem = "CEP informado não foi encontrado." });
        }
    }
    catch (Exception)
    {
        return Results.Json(new { mensagem = "Serviço de validação de CEP indisponível." }, statusCode: 503);
    }

    // Alteração: Agora aceita qualquer cidade, desde que seja dentro do estado de SP
    if (dadosEndereco.Uf != "SP")
    {
        return Results.BadRequest(new { mensagem = "Desculpe, realizamos entregas apenas dentro do estado de São Paulo." });
    }

    try
    {
        // 2. GEOCODIFICAÇÃO (CEP -> Lat/Long)
        var geocodeUrl = $"https://api.tomtom.com/search/2/geocode/{request.CepDestino}.json?key={TOMTOM_KEY}&countrySet=BR";
        var geoResponse = await httpClient.GetFromJsonAsync<JsonNode>(geocodeUrl);

        var position = geoResponse?["results"]?[0]?["position"];
        if (position == null)
        {
            return Results.BadRequest(new { mensagem = "Não foi possível localizar as coordenadas geográficas para este CEP." });
        }

        double latDestino = position["lat"]!.GetValue<double>();
        double lonDestino = position["lon"]!.GetValue<double>();

        string latOrigemStr = LAT_ORIGEM.ToString(CultureInfo.InvariantCulture);
        string lonOrigemStr = LON_ORIGEM.ToString(CultureInfo.InvariantCulture);
        string latDestinoStr = latDestino.ToString(CultureInfo.InvariantCulture);
        string lonDestinoStr = lonDestino.ToString(CultureInfo.InvariantCulture);

        // 3. CÁLCULO DE ROTA (Distância real)
        var routingUrl = $"https://api.tomtom.com/routing/1/calculateRoute/{latOrigemStr},{lonOrigemStr}:{latDestinoStr},{lonDestinoStr}/json?key={TOMTOM_KEY}";
        var routeResponse = await httpClient.GetFromJsonAsync<JsonNode>(routingUrl);

        var summary = routeResponse?["routes"]?[0]?["summary"];
        if (summary == null)
        {
            return Results.BadRequest(new { mensagem = "Não foi possível calcular a rota de entrega." });
        }

        int distanciaEmMetros = summary["lengthInMeters"]!.GetValue<int>();
        double distanciaEmKm = distanciaEmMetros / 1000.0;

        // 🛑 NOVA VALIDAÇÃO: Bloqueia se a rota real passar de 50 km
        if (distanciaEmKm > MAX_DISTANCIA_KM)
        {
            return Results.BadRequest(new
            {
                mensagem = $"Entrega indisponível. A distância atual ({Math.Round(distanciaEmKm, 2)} km) ultrapassa o nosso limite máximo de {MAX_DISTANCIA_KM} km.",
                cidade = dadosEndereco.Localidade
            });
        }

        // 4. CÁLCULO FINANCEIRO DO VALOR
        decimal valorFinalFrete = (decimal)distanciaEmKm * VALOR_POR_KM;

        distanciaEmKm = Math.Round(distanciaEmKm, 2);
        valorFinalFrete = Math.Round(valorFinalFrete, 2);

        var resultadoFinal = new FreteResponse(
            CEP_ORIGEM,
            request.CepDestino,
            dadosEndereco.Logradouro,
            dadosEndereco.Bairro,
            dadosEndereco.Localidade,
            distanciaEmKm,
            valorFinalFrete
        );

        return Results.Ok(resultadoFinal);
    }
    catch (Exception ex)
    {
        return Results.Json(new { mensagem = "Erro ao integrar com os serviços da TomTom.", detalhe = ex.Message }, statusCode: 500);
    }
});

app.Run();

public record FreteRequest(string CepDestino);
public record FreteResponse(string CepOrigem, string CepDestino, string LogradouroDestino, string BairroDestino, string CidadeDestino, double DistanciaKm, decimal ValorFrete);

public class ViaCepResponse
{
    [JsonPropertyName("logradouro")] public string Logradouro { get; set; } = string.Empty;
    [JsonPropertyName("bairro")] public string Bairro { get; set; } = string.Empty;
    [JsonPropertyName("localidade")] public string Localidade { get; set; } = string.Empty;
    [JsonPropertyName("uf")] public string Uf { get; set; } = string.Empty;
    [JsonPropertyName("erro")] public bool Erro { get; set; }
}