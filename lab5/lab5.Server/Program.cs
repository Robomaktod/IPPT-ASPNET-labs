using lab5.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// DI
builder.Services.AddScoped<IPhoneBookStorage, FilePhoneBookStorage>();
builder.Services.AddScoped<IPhoneBookService, PhoneBookService>();

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

// app.UseHttpsRedirection();

app.MapControllers();

app.Run();
