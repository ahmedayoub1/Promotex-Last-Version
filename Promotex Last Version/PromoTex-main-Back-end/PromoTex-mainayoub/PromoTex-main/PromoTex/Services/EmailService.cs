using System.Net.Mail;
using System.Net;

namespace PromoTex.Services
{
    public class SmtpEmailSender : IEmailSenderService
    {
        private readonly IConfiguration _configuration;

        public SmtpEmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            try
            {
                Console.WriteLine("🔔 Preparing SMTP client...");
                using var smtpClient = new SmtpClient(_configuration["Smtp:Host"])
                {
                    Port = int.Parse(_configuration["Smtp:Port"] ?? "587"),
                    Credentials = new NetworkCredential(
                        _configuration["Smtp:Username"],
                        _configuration["Smtp:Password"]
                    ),
                    EnableSsl = true,
                };

                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(_configuration["Smtp:Sender"]),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true,
                };

                mailMessage.To.Add(to);

                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                // يمكنك استبداله بـ logging أو المعالجة المناسبة
                throw new InvalidOperationException("Failed to send email", ex);
            }
        }
    }
}
