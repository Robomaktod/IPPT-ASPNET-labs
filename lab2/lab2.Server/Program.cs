using lab2.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Реєструємо контролери (Web API)
builder.Services.AddControllers();

// Реєструємо наш сервіс з логікою лаби
builder.Services.AddScoped<ILab2Service, Lab2Service>();

// CORS для React
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();

// app.UseHttpsRedirection(); // не обов'язково

app.MapControllers();

app.Run();
