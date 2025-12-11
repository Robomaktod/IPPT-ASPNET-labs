using lab3.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Наш сервіс
builder.Services.AddScoped<ILab3Service, Lab3Service>();

// CORS, щоб React міг ходити на API
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

// app.UseHttpsRedirection(); // можна не вмикати для лаби

app.MapControllers();

app.Run();
