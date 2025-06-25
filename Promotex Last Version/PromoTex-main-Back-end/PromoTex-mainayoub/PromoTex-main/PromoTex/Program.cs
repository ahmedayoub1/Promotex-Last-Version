using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PromoTex.Data_Access;
using PromoTex.Models;
using PromoTex.Services;
using PromoTex.Utility;

namespace PromoTex
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // ✅ Add EF Core DbContext
            builder.Services.AddDbContext<ApplicationDbContext>(
                options => options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection"))
            );

            // ✅ Add Identity
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedAccount = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            // ✅ Email confirmation token lifetime
            builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
            {
                options.TokenLifespan = TimeSpan.FromDays(1);
            });

            // ✅ Add Distributed Cache (required for session)
            builder.Services.AddDistributedMemoryCache();

            // ✅ Add Session
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            // ✅ Register custom services
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IEmailSenderService, SmtpEmailSender>();
            builder.Services.AddScoped<ITemplateRenderer, TemplateRenderer>();

            // ✅ CORS Policy
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
                {
                    policy
                        .SetIsOriginAllowed(origin => true)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            var app = builder.Build();

          
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage(); // ⬅️ لعرض أخطاء مفيدة
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors(MyAllowSpecificOrigins); // ⬅️ تأكد إنها هنا

            app.UseSession();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseStatusCodePages();

            app.MapControllers();

            await app.RunAsync();
        }
    }
}
