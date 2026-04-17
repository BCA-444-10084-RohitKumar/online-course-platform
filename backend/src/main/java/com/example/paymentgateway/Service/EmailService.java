package com.example.paymentgateway.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@eduverse.com}")
    private String fromEmail;

    public void sendPaymentConfirmation(String to, String name,
                                        String courseName, Double amount) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("🎓 Payment Confirmed — " + courseName + " | EduVerse");

            String html = """
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: 'DM Sans', Arial, sans-serif; background: #050a14; color: #f0f4ff; margin: 0; padding: 0; }
                    .wrapper { max-width: 560px; margin: 40px auto; background: #0d1525;
                               border: 1px solid #1a2840; border-radius: 20px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #f59e0b, #ef4444);
                              padding: 32px 40px; text-align: center; }
                    .header h1 { margin: 0; font-size: 26px; color: #fff; }
                    .header p  { margin: 8px 0 0; color: rgba(255,255,255,0.85); }
                    .body      { padding: 36px 40px; }
                    .greeting  { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
                    .box       { background: #111e33; border: 1px solid #1a2840;
                                 border-radius: 14px; padding: 20px 24px; margin: 20px 0; }
                    .box-row   { display: flex; justify-content: space-between;
                                 padding: 8px 0; border-bottom: 1px solid #1a2840; }
                    .box-row:last-child { border-bottom: none; }
                    .label     { color: #8899bb; font-size: 14px; }
                    .value     { font-weight: 600; color: #f0f4ff; font-size: 14px; }
                    .amount    { color: #f59e0b; font-size: 20px; font-weight: 700; }
                    .btn       { display: inline-block; background: linear-gradient(135deg,#f59e0b,#ef4444);
                                 color: #fff; text-decoration: none; padding: 14px 32px;
                                 border-radius: 10px; font-weight: 700; font-size: 15px; margin: 16px 0; }
                    .footer    { text-align: center; padding: 20px 40px; border-top: 1px solid #1a2840;
                                 color: #4a5a7a; font-size: 12px; }
                  </style>
                </head>
                <body>
                  <div class="wrapper">
                    <div class="header">
                      <h1>🎓 EduVerse</h1>
                      <p>Payment Confirmation</p>
                    </div>
                    <div class="body">
                      <p class="greeting">Hi %s! 👋</p>
                      <p style="color:#8899bb;line-height:1.7;">
                        Your payment has been successfully processed. You now have
                        <strong style="color:#f0f4ff">full lifetime access</strong> to the course below.
                      </p>
                      <div class="box">
                        <div class="box-row">
                          <span class="label">Course</span>
                          <span class="value">%s</span>
                        </div>
                        <div class="box-row">
                          <span class="label">Amount Paid</span>
                          <span class="value amount">₹%.2f</span>
                        </div>
                        <div class="box-row">
                          <span class="label">Status</span>
                          <span class="value" style="color:#10b981">✅ Confirmed</span>
                        </div>
                      </div>
                      <p style="text-align:center">
                        <a href="http://localhost:5173/dashboard" class="btn">Go to My Courses →</a>
                      </p>
                      <p style="color:#4a5a7a;font-size:13px;line-height:1.6;">
                        If you have any questions, reply to this email and we'll be happy to help.
                        Happy learning! 🚀
                      </p>
                    </div>
                    <div class="footer">
                      © 2025 EduVerse · All rights reserved<br>
                      You received this because you made a purchase on EduVerse.
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(name, courseName, amount);

            helper.setText(html, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("⚠️ Email send failed: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("🎉 Welcome to EduVerse, " + name + "!");
            helper.setText("""
                <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px;
                            background:#0d1525;color:#f0f4ff;border-radius:16px;">
                  <h2 style="color:#f59e0b">Welcome aboard, %s! 🎓</h2>
                  <p style="color:#8899bb">Your EduVerse account has been created. Explore our catalog
                  and start your learning journey today.</p>
                  <a href="http://localhost:5173"
                     style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#ef4444);
                            color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;
                            font-weight:700;margin-top:16px;">Browse Courses →</a>
                </div>
                """.formatted(name), true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("⚠️ Welcome email failed: " + e.getMessage());
        }
    }
}
