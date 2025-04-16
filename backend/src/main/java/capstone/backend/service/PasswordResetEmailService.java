package capstone.backend.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

@Service
public class PasswordResetEmailService {
	@Value("${sendgrid.api-key}")
	private String sendGridApiKey;

	@Value("${app.password-reset-url}")
	private String passwordResetUrl;

	@Value("${app.email.from}")
	private String fromEmail;

	@Value("${app.email.from-name}")
	private String fromName;

	public void sendEmail(String toEmail, String token) {
		String resetLink = passwordResetUrl + "?token=" + token;

		Email from = new Email(fromEmail, fromName);
		Email to = new Email(toEmail);
		String subject = "Reset Your Password";
		Content content = new Content("text/plain",
				"To reset your password, click this link:\n\n" + resetLink
						+ "\n\nThis link will expire in 1 hour for your security."
						+ "\n\nIf you did not request a password reset, you can safely ignore this message.");

		Mail mail = new Mail(from, subject, to, content);
		SendGrid sg = new SendGrid(sendGridApiKey);
		Request request = new Request();

		try {
			request.setMethod(Method.POST);
			request.setEndpoint("mail/send");
			request.setBody(mail.build());
			sg.api(request);
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}
}
