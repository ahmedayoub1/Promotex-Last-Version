using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using PromoTex.Data_Access;
using PromoTex.DTO;
using PromoTex.Models;
using PromoTex.Services;
using PromoTex.Utility;
using System.Net;

namespace PromoTex.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration config;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly ApplicationDbContext applicationDb;
        private readonly ITemplateRenderer templateRenderer;
        private readonly IEmailSenderService emailSender;

        public AccountController(UserManager<ApplicationUser> userManager,
            IConfiguration config,
            SignInManager<ApplicationUser> signInManager,
            ApplicationDbContext applicationDb,
            ITemplateRenderer templateRenderer,
            IEmailSenderService emailSender)
        {
            this.userManager = userManager;
            this.config = config;
            this.signInManager = signInManager;
            this.applicationDb = applicationDb;
            this.templateRenderer = templateRenderer;
            this.emailSender = emailSender;
        }

        //[HttpPost("Register")]
        //public async Task<IActionResult> Register(RegisterDTO userDTO)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        ApplicationUser user = new ApplicationUser()
        //        {
        //            Email = userDTO.Email,
        //            UserName = userDTO.Email.Split('@')[0],
        //            FullName = userDTO.FullName,
        //            FullAddress = userDTO.FullAddress,
        //            PhoneNumber = userDTO.PhoneNumber,
        //        };

        //        var result = await userManager.CreateAsync(user, userDTO.Password);
        //        if (result.Succeeded)
        //        {
        //            await userManager.AddToRoleAsync(user, StaticData.CustomerRole);

        //            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        //            var encodedToken = WebUtility.UrlEncode(token);

        //            var baseUrl = $"{Request.Scheme}://{Request.Host}";
        //            var confirmUrl = $"{baseUrl}/api/user/confirm-email?userId={user.Id}&token={encodedToken}";

        //            var htmlContent = await templateRenderer.RenderTemplateAsync("Templates/EmailConfirmation.html",
        //                new Dictionary<string, string>
        //                {
        //                    { "name", user.UserName },
        //                    { "action_url", confirmUrl }
        //                });

        //            await emailSender.SendEmailAsync(user.Email, "Confirm your email", htmlContent);

        //            // ✅ Save user info to session
        //            HttpContext.Session.SetString("UserId", user.Id);
        //            HttpContext.Session.SetString("UserName", user.UserName);
        //            HttpContext.Session.SetString("Email", user.Email);
        //            HttpContext.Session.SetString("FullName", user.FullName ?? "");
        //            HttpContext.Session.SetString("FullAddress", user.FullAddress ?? "");
        //            HttpContext.Session.SetString("Role", StaticData.CustomerRole);

        //            return Ok("User created! Please check your email to confirm your account.");
        //        }

        //        foreach (var item in result.Errors)
        //        {
        //            ModelState.AddModelError("", item.Description);
        //        }
        //    }

        //    return BadRequest(ModelState);
        //}


        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDTO userDTO)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = new ApplicationUser()
                {
                    Email = userDTO.Email,
                    UserName = userDTO.Email.Split('@')[0],
                    FullName = userDTO.FullName,
                    FullAddress = userDTO.FullAddress,
                    PhoneNumber = userDTO.PhoneNumber,
                };

                var result = await userManager.CreateAsync(user, userDTO.Password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, StaticData.CustomerRole);

                    var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
                    var encodedToken = WebUtility.UrlEncode(token);

                    var baseUrl = $"{Request.Scheme}://{Request.Host}";
                    var confirmUrl = $"{baseUrl}/api/user/confirm-email?userId={user.Id}&token={encodedToken}";

                    string htmlContent;
                    try
                    {
                        Console.WriteLine("🧪 Rendering email template...");

                        htmlContent = await templateRenderer.RenderTemplateAsync("Templates/EmailConfirmation.html",
                            new Dictionary<string, string>
                            {
                        { "name", user.UserName },
                        { "action_url", confirmUrl }
                            });

                        Console.WriteLine("✅ Template rendered successfully.");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("❌ Error rendering template: " + ex.Message);
                        // fallback to basic email content
                        htmlContent = $"<h1>Welcome {user.UserName}!</h1><p>Please confirm your email by clicking <a href='{confirmUrl}'>here</a>.</p>";
                    }

                    try
                    {
                        Console.WriteLine("📨 Sending confirmation email to: " + user.Email);
                        await emailSender.SendEmailAsync(user.Email, "Confirm your email", htmlContent);
                        Console.WriteLine("✅ Email sent successfully.");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("❌ Failed to send email: " + ex.Message);
                        ModelState.AddModelError("Email", "User created but email sending failed.");
                        return StatusCode(500, ModelState);
                    }

                    // ✅ Save user info to session
                    HttpContext.Session.SetString("UserId", user.Id);
                    HttpContext.Session.SetString("UserName", user.UserName);
                    HttpContext.Session.SetString("Email", user.Email);
                    HttpContext.Session.SetString("FullName", user.FullName ?? "");
                    HttpContext.Session.SetString("FullAddress", user.FullAddress ?? "");
                    HttpContext.Session.SetString("Role", StaticData.CustomerRole);

                    return Ok("User created! Please check your email to confirm your account.");
                }

                foreach (var item in result.Errors)
                {
                    ModelState.AddModelError("", item.Description);
                }
            }

            return BadRequest(ModelState);
        }



        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            var appUser = await userManager.FindByEmailAsync(loginDTO.Email);

            if (appUser != null)
            {
                if (!appUser.EmailConfirmed)
                {
                    ModelStateDictionary errors = new();
                    errors.AddModelError("Error", "Please confirm your email before logging in.");
                    return BadRequest(errors);
                }

                if (await userManager.IsLockedOutAsync(appUser))
                {
                    ModelStateDictionary errors = new();
                    errors.AddModelError("Error", "Your account is locked. Please try again later or contact support.");
                    return BadRequest(errors);
                }

                var result = await userManager.CheckPasswordAsync(appUser, loginDTO.Password);

                if (result)
                {
                    await signInManager.SignInAsync(appUser, loginDTO.RemeberMe);

                    var roles = await userManager.GetRolesAsync(appUser);
                    var role = roles.FirstOrDefault();

                    // ✅ Store user in session
                    HttpContext.Session.SetString("UserId", appUser.Id);
                    HttpContext.Session.SetString("UserName", appUser.UserName);
                    HttpContext.Session.SetString("Email", appUser.Email);
                    HttpContext.Session.SetString("FullName", appUser.FullName ?? "");
                    HttpContext.Session.SetString("FullAddress", appUser.FullAddress ?? "");
                    HttpContext.Session.SetString("Role", role ?? "");

                    var userDto = new
                    {
                        appUser.Id,
                        appUser.UserName,
                        appUser.Email,
                        appUser.FullName,
                        appUser.FullAddress,
                        Role = roles
                    };

                    return Ok(userDto);
                }
                else
                {
                    ModelStateDictionary errors = new();
                    errors.AddModelError("Error", "Invalid email or password.");
                    return BadRequest(errors);
                }
            }

            return NotFound();
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            HttpContext.Session.Clear(); // ✅ Clear all session data
            return Ok("User is signed out");
        }
        [HttpPost("SendTestEmail")]
        public async Task<IActionResult> SendTestEmail(string to)
        {
            await emailSender.SendEmailAsync(to, "Test Email", "<h1>This is a test</h1>");
            return Ok("Test email sent.");
        }

    }
}
