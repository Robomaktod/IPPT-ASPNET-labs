using lab4.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Наш сервіс
builder.Services.AddScoped<ILab4Service, Lab4Service>();

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

// app.UseHttpsRedirection(); // опційно

app.MapControllers();

app.Run();
